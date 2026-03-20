const Tenant = require('../../models/superadmin/Tenant');
const User = require('../../models/tenant/User');
const bcrypt = require('bcryptjs');

// @desc    Get all tenants/companies
// @route   GET /api/superadmin/companies
// @access  Private/SuperAdmin
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 }).lean();
    
    // Enrich with user and role counts
    const enrichedTenants = await Promise.all(
      tenants.map(async (tenant) => {
        const [userCount, managerCount, employeeCount] = await Promise.all([
          User.countDocuments({ tenant: tenant._id }),
          User.countDocuments({ tenant: tenant._id, role: 'manager' }),
          User.countDocuments({ tenant: tenant._id, role: 'employee' })
        ]);
        return { ...tenant, userCount, managerCount, employeeCount };
      })
    );
    // Compute Global Stats from enriched tenants
    const totalOrganizations = enrichedTenants.length;
    const activeOrganizations = enrichedTenants.filter(t => t.onboardingStatus === 'active').length;
    const globalWorkforceNodes = enrichedTenants.reduce((sum, t) => sum + (t.userCount || 0), 0);
    const avgUtilization = enrichedTenants.length ? 
      (enrichedTenants.reduce((sum, t) => sum + ((t.userCount || 0) / (t.subscription?.employeeLimit || 50)), 0) / enrichedTenants.length * 100).toFixed(1) : '0.0';

    res.json({
      stats: {
        totalOrganizations,
        activeOrganizations,
        globalWorkforceNodes,
        avgUtilization
      },
      data: enrichedTenants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Provision new tenant
// @route   POST /api/superadmin/companies
// @access  Private/SuperAdmin
exports.provisionTenant = async (req, res) => {
  const { name, domain, adminEmail, password, plan, industry } = req.body;

  try {
    // Determine employee limit based on plan
    const planLimits = { basic: 10, premium: 50, enterprise: 1000 };
    const normalizedPlan = plan.toLowerCase();

    // 1. Create Tenant
    const tenant = await Tenant.create({
      name,
      domain,
      industry: industry || 'Technology',
      subscription: {
        plan: normalizedPlan,
        status: 'active',
        employeeLimit: planLimits[normalizedPlan] || 50
      }
    });

    // 2. Create Tenant Admin User (password is auto-hashed by User model's pre-save hook)
    const adminUser = await User.create({
      name: `${name} Admin`,
      email: adminEmail,
      password: password || 'admin123',
      role: 'tenant',
      company: name,
      tenant: tenant._id
    });

    res.status(201).json({
      message: 'Tenant provisioned successfully',
      tenant,
      adminUser
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update tenant status
// @route   PATCH /api/superadmin/companies/:id/status
// @access  Private/SuperAdmin
exports.updateTenantStatus = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { onboardingStatus: req.body.status },
      { new: true }
    );
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// @desc    Update tenant details
// @route   PUT /api/superadmin/companies/:id
// @access  Private/SuperAdmin
exports.updateTenant = async (req, res) => {
  const { name, domain, industry, plan } = req.body;
  
  try {
    const updateData = { name, domain, industry };
    
    if (plan) {
      const planLimits = { basic: 10, premium: 50, enterprise: 1000 };
      const normalizedPlan = plan.toLowerCase();
      updateData.subscription = {
        plan: normalizedPlan,
        employeeLimit: planLimits[normalizedPlan] || 50
      };
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true }
    );
    
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle tenant suspension
// @route   PATCH /api/superadmin/companies/:id/suspend
// @access  Private/SuperAdmin
exports.toggleTenantSuspension = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    
    tenant.onboardingStatus = tenant.onboardingStatus === 'suspended' ? 'active' : 'suspended';
    await tenant.save();
    
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete tenant
// @route   DELETE /api/superadmin/companies/:id
// @access  Private/SuperAdmin
exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    
    // Optionally delete associated users
    await User.deleteMany({ tenant: req.params.id });
    
    res.json({ message: 'Tenant and associated users deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
