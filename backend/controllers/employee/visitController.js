const StoreVisit = require('../../models/employee/StoreVisit');
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

    const visits = await StoreVisit.find(query)
      .select('-checklist')
      .populate('employee', 'name email')
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
    const visit = await StoreVisit.findOne({ _id: req.params.id, tenant: req.tenantId })
      .populate('employee', 'name email')
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
  const { storeName, status, gps, notes } = req.body;

  try {
    const visit = await StoreVisit.create({
      employee: req.user._id,
      tenant: req.tenantId,
      storeName,
      status,
      gps,
      notes,
    });

    // NEW: Log Activity
    await logActivity({
      userId: req.user._id,
      tenantId: req.tenantId,
      type: 'visit_end',
      title: 'Store Visit Finished',
      details: `Employee finished a visit at ${storeName} with status: ${status}.`,
      status: status === 'completed' ? 'success' : 'info',
      metadata: { visitId: visit._id, store: storeName }
    });

    res.status(201).json(visit);
  } catch (error) {
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
        console.log(`[WORKFLOW] Visit ${visit._id} rejected. Reverting Task ${visit.taskId} to rejected.`);
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
