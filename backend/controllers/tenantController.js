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
    const { name, email, password, team, zone, designation, status } = req.body;

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
      status: status || 'Active',
      profile: {
        team: team || '',
        zone: zone || '',
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
    const { name, team, zone, designation, status } = req.body;

    const manager = await User.findOne({ _id: id, tenant: req.tenantId });

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    if (name) manager.name = name;
    if (status) manager.status = status;
    
    if (!manager.profile) {
      manager.profile = {};
    }

    if (team !== undefined) manager.profile.team = team;
    if (zone !== undefined) manager.profile.zone = zone;
    if (designation !== undefined) manager.profile.designation = designation;
    
    // Kept map for legacy compatibility
    if (status === 'Inactive') manager.isDeactivated = true;
    else if (status === 'On Duty' || status === 'Active') manager.isDeactivated = false;

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

// @desc    Create a new employee
// @route   POST /api/tenant/employees
// @access  Private (Manager/Tenant)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, team, zone, designation, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const currentUser = await User.findById(req.user.id);

    const employee = await User.create({
      name,
      email,
      password,
      role: 'employee',
      tenant: req.tenantId,
      company: currentUser ? currentUser.company : 'Unknown',
      status: status || 'Active',
      profile: {
        team: team || '',
        zone: zone || '',
        designation: designation || 'Employee'
      }
    });

    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    res.status(201).json(employeeResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/tenant/employees/:id
// @access  Private (Manager/Tenant)
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team, zone, designation, status } = req.body;

    const employee = await User.findOne({ _id: id, tenant: req.tenantId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (name) employee.name = name;
    if (status) employee.status = status;
    
    if (!employee.profile) {
      employee.profile = {};
    }

    if (team !== undefined) employee.profile.team = team;
    if (zone !== undefined) employee.profile.zone = zone;
    if (designation !== undefined) employee.profile.designation = designation;
    
    if (status !== undefined) {
      if (status === 'Inactive') employee.isDeactivated = true;
      else if (status === 'On Duty' || status === 'Active') employee.isDeactivated = false;
    }

    await employee.save();

    const updatedEmployee = employee.toObject();
    delete updatedEmployee.password;

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/tenant/employees/:id
// @access  Private (Manager/Tenant)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ _id: id, tenant: req.tenantId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
