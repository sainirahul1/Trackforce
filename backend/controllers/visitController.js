const StoreVisit = require('../models/employee/StoreVisit');

// @desc    Get all store visits for the tenant
// @route   GET /api/visits
// @access  Private (Tenant/Manager/Employee)
exports.getVisits = async (req, res) => {
  try {
    // Data Isolation: Only find visits that match the requester's tenant ID
    const visits = await StoreVisit.find({ tenant: req.tenantId })
      .populate('employee', 'name email');
    
    res.json(visits);
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
