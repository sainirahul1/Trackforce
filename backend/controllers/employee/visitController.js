const StoreVisit = require('../../models/employee/StoreVisit');

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
      .sort({ timestamp: -1 });
    
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
      .populate('employee', 'name email');
    
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
      tenant: req.tenantId, // Automatically use the tenant ID from middleware
      storeName,
      status,
      gps,
      notes,
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
    }

    if (req.body.rejectionReason) {
      visit.rejectionReason = req.body.rejectionReason;
    }

    await visit.save();

    const updatedVisit = await StoreVisit.findById(visit._id)
      .populate('employee', 'name email')
      .populate('reviewedBy', 'name');

    res.json(updatedVisit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
