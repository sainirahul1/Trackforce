const User = require('../models/tenant/User');

// @desc    Get all employees for a tenant
// @route   GET /api/tenant/employees
// @access  Private (Manager/Tenant)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ 
      tenant: req.tenantId,
      role: 'employee'
    }).select('name email _id');

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
