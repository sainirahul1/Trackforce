const StoreVisit = require('../../models/employee/StoreVisit');
const EmployeeLogVisit = require('../../models/employee/EmployeeLogVisit');
const Task = require('../../models/employee/Task');
const { logActivity } = require('../../utils/activityLogger');

// @desc    Get all store visits for the tenant
// @route   GET /api/visits
// @access  Private (Tenant/Manager/Employee)
exports.getVisits = async (req, res) => {
  try {
    // Lean fetch: exclude photos and checklist for the main list to improve performance
    const query = { tenant: req.tenantId };

    // If the user is an employee, only show their own visits
    if (req.user && req.user.role === 'employee') {
      query.employee = req.user._id;
    }

    const visits = await EmployeeLogVisit.find(query)
      .select('-checklist')
      .populate('employee', 'name email status profile')
      .sort({ timestamp: -1 })
      .lean();
    
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single visit details
// @route   GET /api/visits/:id
// @access  Private
exports.getVisitById = async (req, res) => {
  try {
    const visit = await EmployeeLogVisit.findOne({ _id: req.params.id, tenant: req.tenantId })
      .populate('employee', 'name email status profile')
      .lean();
    
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new store visit
// @route   POST /api/visits
// @access  Private (Employee)
exports.createVisit = async (req, res) => {
  const { 
    storeName, ownerName, mobileNumber, 
    status, visitType, gps, notes, 
    address, city, state, pinCode,
    classification, milestones,
    photos, taskId, taskTitle, taskType, checklist, 
    missionId, missionType, missionScore, ...rest 
  } = req.body;

  try {
    // Map internal status to lowercase if needed for enum compatibility
    // Resiliency: check 'outcome' as fallback for 'status'
    const rawStatus = status || rest.outcome || rest.status;
    let visitStatus = 'completed';

    if (rawStatus) {
      const lowerStatus = rawStatus.toLowerCase();
      if (lowerStatus.includes('interested') && !lowerStatus.includes('not')) visitStatus = 'completed';
      else if (lowerStatus.includes('not_interested') || lowerStatus.includes('not interested')) visitStatus = 'not_interested';
      else if (lowerStatus.includes('follow') || lowerStatus.includes('schedule')) visitStatus = 'follow_up';
      else if (lowerStatus.includes('negotiation') || lowerStatus.includes('audit')) visitStatus = 'partially_completed';
      else visitStatus = lowerStatus.replace(/ /g, '_');
    }

    // DATA PRUNING: Ensure no large base64 strings accidentally end up in visitForm
    // This keeps the metadata lean and prevents BSON limit crashes.
    const visitForm = { ...rest };
    Object.keys(visitForm).forEach(key => {
      if (typeof visitForm[key] === 'string' && visitForm[key].startsWith('data:image/')) {
        delete visitForm[key];
      }
    });

    const visit = await EmployeeLogVisit.create({
      employee: req.user._id,
      tenant: req.tenantId,
      taskId: taskId || null,
      storeName: storeName || rest.supplierName || rest.partnerName || 'Unknown Store',
      ownerName: ownerName || rest.contactPerson || '',
      mobileNumber: mobileNumber || rest.phone || '',
      visitType: visitType || 'mission',
      status: visitStatus,
      gps: gps || { lat: rest.latitude, lng: rest.longitude },
      notes: notes || rest.feedback || rest.notes || '',
      address: address || rest.location || '',
      city: city || '',
      state: state || '',
      pinCode: pinCode || '',
      classification: classification || '',
      milestones: milestones || {
        initialCheck: rest.appDownloaded || false,
        knowledgeShared: rest.appTraining || false,
        orderLogged: rest.orderPlaced || false,
      },
      photos: photos || [],
      timestamp: new Date()
    });

    // Mirror to StoreVisit legacy system for background compatibility
    try {
      await StoreVisit.create({
         ...req.body,
         employee: req.user._id,
         tenant: req.tenantId,
         status: visitStatus
      });
    } catch (mirrorError) {
      console.warn('[MIRROR ERROR] Failed to sync with legacy StoreVisit:', mirrorError.message);
      // We don't throw here to ensure the primary mission log (EmployeeLogVisit) is still recorded successfully
    }

    // NEW: Log Activity
    await logActivity({
      userId: req.user._id,
      tenantId: req.tenantId,
      type: 'visit_end',
      title: 'Field Visit Logged',
      details: `Employee logged a ${visitStatus} visit for ${visit.storeName}.`,
      status: visitStatus === 'completed' ? 'success' : 'info',
      metadata: { visitId: visit._id, store: visit.storeName }
    });

    // REAL-TIME SYNC: Notify mangers about the new visit
    const io = req.app.get('io');
    if (io) {
      const populatedVisit = await EmployeeLogVisit.findById(visit._id)
        .populate('employee', 'name email profile')
        .lean();
      
      const room = `tenant:${req.tenantId}:role:manager`;
      io.to(room).emit('visit:new', populatedVisit);
    }

    res.status(201).json(visit);
  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a store visit (Manager review: accept/reject)
// @route   PATCH /api/visits/:id
// @access  Private (Manager/Superadmin)
exports.updateVisit = async (req, res) => {
  try {
    const visit = await StoreVisit.findOne({ _id: req.params.id, tenant: req.tenantId });

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    // If updating reviewStatus, track who reviewed it
    if (req.body.reviewStatus) {
      visit.reviewStatus = req.body.reviewStatus;
      visit.reviewedBy = req.user._id;

      // NEW: Task Reversion Logic
      if (req.body.reviewStatus === 'rejected' && visit.taskId) {
        await Task.findByIdAndUpdate(visit.taskId, { 
          status: 'rejected', 
          missionStatus: 'Rejected' 
        });
      }
    }

    if (req.body.rejectionReason) {
      visit.rejectionReason = req.body.rejectionReason;
    }

    await visit.save();

    res.json(visit);

    // NEW: Log Activity for manager review
    if (req.body.reviewStatus) {
      await logActivity({
        userId: req.user._id,
        tenantId: req.tenantId,
        type: 'alert',
        title: `Visit ${req.body.reviewStatus.toUpperCase()}`,
        details: `Manager ${req.user.name} ${req.body.reviewStatus} the visit at ${visit.storeName}.`,
        status: req.body.reviewStatus === 'accepted' ? 'success' : 'warning',
        metadata: { visitId: visit._id, reviewStatus: req.body.reviewStatus }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
