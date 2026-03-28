const User = require('../models/tenant/User');
<<<<<<< HEAD
const TenantSettings = require('../models/tenant/Settings');
const bcrypt = require('bcryptjs');
=======
const Subscription = require('../models/superadmin/Subscription');
>>>>>>> ten_sub

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

// @desc    Get tenant settings
// @route   GET /api/tenant/settings
// @access  Private (Tenant)
exports.getTenantSettings = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.user.tenant;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is missing' });
    }

    let settings = await TenantSettings.findOne({ tenantId });
    if (!settings) {
      console.log(`Settings not found for tenant ${tenantId}, creating new document...`);
      settings = await TenantSettings.create({ tenantId });
      console.log('Created settings with defaults:', settings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update General Info
// @route   PUT /api/tenant/settings/general
// @access  Private (Tenant)
exports.updateGeneralInfo = async (req, res) => {
  try {
    const { companyName, officialEmail, hqAddress, logoUrl } = req.body;
    const tenantId = req.tenantId || req.user.tenant;

    console.log(`[DEBUG] Update General Request for tenant ${tenantId}:`, { 
      companyName, 
      officialEmail, 
      hqAddress,
      hasLogo: !!logoUrl 
    });

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is missing' });
    }

    let settings = await TenantSettings.findOne({ tenantId });
    
    if (!settings) {
      console.log(`[DEBUG] No settings document found, creating one...`);
      settings = new TenantSettings({ tenantId });
    }

    // Explicitly update fields using standard assignment for reliable change tracking
    if (!settings.general) settings.general = {};
    settings.general.companyName = companyName || settings.general.companyName || '';
    settings.general.officialEmail = officialEmail || settings.general.officialEmail || '';
    settings.general.hqAddress = hqAddress || settings.general.hqAddress || '';
    if (logoUrl) settings.general.logoUrl = logoUrl;

    console.log(`[DEBUG] Settings state before save:`, JSON.stringify(settings.general));
    
    const updatedSettings = await settings.save();
    
    console.log(`[DEBUG] Saved to Atlas successfully:`, updatedSettings.general.companyName);
    res.json(updatedSettings);
  } catch (error) {
    console.error(`[ERROR] General Info Update Failure:`, error.message);
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

// @desc    Update Password
// @route   PUT /api/tenant/settings/password
// @access  Private (Tenant)
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const tenantId = req.tenantId || req.user.tenant;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    // Also update security metadata in tenant settings to comply with "all related in same collection"
    if (tenantId) {
      await TenantSettings.findOneAndUpdate(
        { tenantId },
        { $set: { 'security.lastPasswordChange': new Date() } },
        { upsert: true }
      );
    }

    res.json({ message: 'Password updated successfully' });
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

// @desc    Update Localization
// @route   PUT /api/tenant/settings/localization
// @access  Private (Tenant)
exports.updateLocalization = async (req, res) => {
  try {
    const { timezone, language } = req.body;
    const tenantId = req.tenantId || req.user.tenant;

    console.log(`[DEBUG] Update Localization for tenant ${tenantId}:`, { timezone, language });

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is missing' });
    }

    let settings = await TenantSettings.findOne({ tenantId });
    
    if (!settings) {
      settings = new TenantSettings({ tenantId });
    }

    if (!settings.localization) settings.localization = {};
    settings.localization.timezone = timezone || settings.localization.timezone || 'EST';
    settings.localization.language = language || settings.localization.language || 'en';

    const updatedSettings = await settings.save();
    
    console.log(`[DEBUG] Localization Save Result:`, updatedSettings.localization);
    res.json(updatedSettings);
  } catch (error) {
    console.error(`[ERROR] Localization Update Failure:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Account Preferences
// @route   PUT /api/tenant/settings/account
// @access  Private (Tenant)
exports.updateAccountPreferences = async (req, res) => {
  try {
    const { status, featureFlags } = req.body;
    const tenantId = req.tenantId || req.user.tenant;

    console.log(`[DEBUG] Update Account Prefs for tenant ${tenantId}:`, { status, featureFlags });

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is missing' });
    }

    let settings = await TenantSettings.findOne({ tenantId });
    
    if (!settings) {
      settings = new TenantSettings({ tenantId });
    }

    if (!settings.account) settings.account = {};
    settings.account.status = status || settings.account.status || 'Active';
    settings.account.featureFlags = featureFlags || [];

    const updatedSettings = await settings.save();
    
    console.log(`[DEBUG] Account Save Result:`, updatedSettings.account);
    res.json(updatedSettings);
  } catch (error) {
    console.error(`[ERROR] Account Update Failure:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request Data Export
// @route   GET /api/tenant/settings/export
// @access  Private (Tenant)
exports.requestDataExport = async (req, res) => {
  try {
    // Generate some basic data export for the tenant
    const managers = await User.find({ tenant: req.tenantId, role: 'manager' }).select('-password');
    const employees = await User.find({ tenant: req.tenantId, role: 'employee' }).select('-password');
    const settings = await TenantSettings.findOne({ tenantId: req.tenantId });

    const exportData = {
      tenantId: req.tenantId,
      exportedAt: new Date(),
      settings: settings || {},
      managers,
      employees,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=tenant_data_export.json');
    res.send(JSON.stringify(exportData, null, 2));
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

// @desc    Sign out all managers for a tenant
// @route   POST /api/tenant/settings/signout-managers
// @access  Private (Tenant)
exports.signOutAllManagers = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.user.tenant;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is missing' });
    }

    // 1. Update lastLogoutAt for all managers of this tenant (for auth middleware)
    await User.updateMany(
      { tenant: tenantId, role: 'manager' },
      { $set: { lastLogoutAt: new Date() } }
    );

    // 2. Store the security event in the central tenant.settings collection as requested
    await TenantSettings.findOneAndUpdate(
      { tenantId },
      { $set: { 'security.globalSignOutAt': new Date() } },
      { upsert: true }
    );

    res.json({ message: 'Successfully signed out all the managers' });
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
