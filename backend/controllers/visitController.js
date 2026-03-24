const StoreVisit = require('../models/employee/StoreVisit');

// @desc    Get all store visits for the tenant
// @route   GET /api/visits
// @access  Private (Tenant/Manager/Employee)
exports.getVisits = async (req, res) => {
  try {
    console.log(`[DEBUG] Fetching lean visits for tenant: ${req.tenantId}`);
    // Lean fetch: exclude photos and checklist for the main list to improve performance
    const query = { tenant: req.tenantId };

    // If the user is an employee, only show their own visits
    if (req.user && req.user.role === 'employee') {
      query.employee = req.user._id;
    }

    const visits = await StoreVisit.find(query)
      .select('-photos -checklist')
      .populate('employee', 'name email')
      .sort({ timestamp: -1 });
    
    console.log(`[DEBUG] Found ${visits.length} visits for tenant: ${req.tenantId}`);
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
