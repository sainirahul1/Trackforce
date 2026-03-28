const User = require('../models/tenant/User');
const Subscription = require('../models/superadmin/Subscription');

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

// @desc    Get subscription details for the logged-in tenant
// @route   GET /api/tenant/subscription
// @access  Private (Tenant only)
exports.getSubscription = async (req, res) => {
  try {
    if (req.user.role !== 'tenant') {
      return res.status(403).json({ message: 'Access denied. Tenant role required.' });
    }

    const tenantUser = await User.findById(req.user.id).select('subscription name company email');

    if (!tenantUser) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Count current active employees under this tenant
    const employeeCount = await User.countDocuments({
      tenant: tenantUser._id,
      role: 'employee',
      isDeactivated: { $ne: true },
    });

    const sub = tenantUser.subscription || {};

    res.json({
      subscription: {
        plan: sub.plan || 'Free',
        status: sub.status || 'trial',
        price: sub.price || 0,
        startDate: sub.startDate || null,
        nextBillingDate: sub.nextBillingDate || null,
        trialEndsAt: sub.trialEndsAt || null,
        employeeLimit: sub.employeeLimit || 5,
        features: sub.features || [],
        paymentMethod: sub.paymentMethod || {},
        billingHistory: sub.billingHistory || [],
      },
      employeeCount,
      tenantName: tenantUser.name,
      company: tenantUser.company,
      email: tenantUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available subscription plans
// @route   GET /api/tenant/available-plans
// @access  Private (Tenant)
exports.getAvailablePlans = async (req, res) => {
  try {
    const plans = await Subscription.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscription details for the logged-in tenant
// @route   PUT /api/tenant/subscription
// @access  Private (Tenant only)
exports.updateSubscription = async (req, res) => {
  try {
    if (req.user.role !== 'tenant') {
      return res.status(403).json({ message: 'Access denied. Tenant role required.' });
    }

    const { plan, status, price, startDate, nextBillingDate, trialEndsAt, employeeLimit, features, paymentMethod, billingEntry } = req.body;

    // Fetch plan details from database if a plan name is provided
    let dbPlan = null;
    if (plan) {
      dbPlan = await Subscription.findOne({ name: plan, isActive: true });
    }

    const tenantUser = await User.findById(req.user.id);
    if (!tenantUser) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (!tenantUser.subscription) {
      tenantUser.subscription = {};
    }

    if (plan) {
      tenantUser.subscription.plan = plan;
      // Auto-set defaults for price, limit, and features from DB if matched, otherwise keep current or use provided
      if (!price) tenantUser.subscription.price = dbPlan ? Number(dbPlan.price) : tenantUser.subscription.price;
      if (!employeeLimit) tenantUser.subscription.employeeLimit = dbPlan ? dbPlan.employeeLimit : tenantUser.subscription.employeeLimit;
      if (!features) tenantUser.subscription.features = (dbPlan && dbPlan.features) ? dbPlan.features : tenantUser.subscription.features;
    }
    if (status !== undefined) tenantUser.subscription.status = status;
    if (price !== undefined) tenantUser.subscription.price = price;
    if (startDate) tenantUser.subscription.startDate = new Date(startDate);
    if (nextBillingDate) tenantUser.subscription.nextBillingDate = new Date(nextBillingDate);
    if (trialEndsAt) tenantUser.subscription.trialEndsAt = new Date(trialEndsAt);
    if (employeeLimit !== undefined) tenantUser.subscription.employeeLimit = employeeLimit;
    if (features !== undefined) tenantUser.subscription.features = features;
    if (paymentMethod) {
      tenantUser.subscription.paymentMethod = {
        ...tenantUser.subscription.paymentMethod,
        ...paymentMethod,
      };
    }
    // Push a new billing record if provided
    if (billingEntry) {
      if (!tenantUser.subscription.billingHistory) {
        tenantUser.subscription.billingHistory = [];
      }
      tenantUser.subscription.billingHistory.push({
        amount: billingEntry.amount,
        date: billingEntry.date ? new Date(billingEntry.date) : new Date(),
        description: billingEntry.description || '',
        status: billingEntry.status || 'pending',
      });
    }

    await tenantUser.save();

    const employeeCount = await User.countDocuments({
      tenant: tenantUser._id,
      role: 'employee',
      isDeactivated: { $ne: true },
    });

    res.json({
      message: 'Subscription updated successfully',
      subscription: tenantUser.subscription,
      employeeCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
