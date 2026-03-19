const Tenant = require('../../models/superadmin/Tenant');
const User = require('../../models/tenant/User');
const bcrypt = require('bcryptjs');

// @desc    Get all tenants/companies
// @route   GET /api/superadmin/companies
// @access  Private/SuperAdmin
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Provision new tenant
// @route   POST /api/superadmin/companies
// @access  Private/SuperAdmin
exports.provisionTenant = async (req, res) => {
  const { name, domain, adminEmail, password, plan } = req.body;

  try {
    // 1. Create Tenant
    const tenant = await Tenant.create({
      name,
      domain,
      subscription: {
        plan: plan.toLowerCase(),
        status: 'active'
      }
    });

    // 2. Create Tenant Admin User
    const hashedPassword = await bcrypt.hash(password || 'admin123', 10);
    const adminUser = await User.create({
      name: `${name} Admin`,
      email: adminEmail,
      password: hashedPassword,
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
