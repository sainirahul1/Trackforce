const User = require('../models/tenant/User');

// @desc    Get all employees for a tenant
// @route   GET /api/tenant/employees
// @access  Private (Manager/Tenant)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ 
      tenant: req.tenantId,
      role: 'employee'
    }).select('-password');

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all managers for a tenant
// @route   GET /api/tenant/managers
// @access  Private (Tenant)
exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ 
      tenant: req.tenantId,
      role: 'manager'
    }).select('-password');

    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new manager
// @route   POST /api/tenant/managers
// @access  Private (Tenant)
exports.createManager = async (req, res) => {
  try {
    const { name, email, password, team, designation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Get company name from current user (Tenant)
    const currentUser = await User.findById(req.user.id);

    const manager = await User.create({
      name,
      email,
      password,
      role: 'manager',
      tenant: req.tenantId,
      company: currentUser ? currentUser.company : 'Unknown',
      profile: {
        team: team || '',
        designation: designation || 'Operations Manager'
      }
    });

    const managerResponse = manager.toObject();
    delete managerResponse.password;

    res.status(201).json(managerResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a manager
// @route   PUT /api/tenant/managers/:id
// @access  Private (Tenant)
exports.updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team, designation, status } = req.body;

    const manager = await User.findOne({ _id: id, tenant: req.tenantId });

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    if (name) manager.name = name;
    
    if (!manager.profile) {
      manager.profile = {};
    }

    if (team !== undefined) manager.profile.team = team;
    if (designation !== undefined) manager.profile.designation = designation;
    // Status can be mapped to isDeactivated or a new status property. 
    // If you need "On Duty", "Off Duty", usually we add a `status` field. Let's add it if needed, or stick to isDeactivated.
    if (status !== undefined) {
      if (status === 'Inactive') manager.isDeactivated = true;
      else if (status === 'On Duty' || status === 'Active') manager.isDeactivated = false;
    }

    await manager.save();

    const updatedManager = manager.toObject();
    delete updatedManager.password;

    res.json(updatedManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a manager
// @route   DELETE /api/tenant/managers/:id
// @access  Private (Tenant)
exports.deleteManager = async (req, res) => {
  try {
    const { id } = req.params;

    const manager = await User.findOne({ _id: id, tenant: req.tenantId });

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: 'Manager removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
