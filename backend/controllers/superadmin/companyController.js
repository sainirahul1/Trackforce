const mongoose = require('mongoose');
const Tenant = require('../../models/superadmin/Tenant');
const Subscription = require('../../models/superadmin/Subscription');
const User = require('../../models/tenant/User');
const bcrypt = require('bcryptjs');

// Deep Deletion Models
const Document = require('../../models/employee/Document');
const SupplierVisit = require('../../models/employee/SupplierVisit');
const StoreVisit = require('../../models/employee/StoreVisit');
const TrackingSession = require('../../models/employee/TrackingSession');
const Location = require('../../models/employee/Location');
const EmployeeDashboard = require('../../models/employee/Dashboard');
const ActivityLog = require('../../models/employee/ActivityLog');
const Task = require('../../models/employee/Task');
const Order = require('../../models/employee/Order');
const Profile = require('../../models/employee/Profile');
const Collaboration = require('../../models/manager/Collaboration');
const ManagerOrder = require('../../models/manager/ManagerOrder');
const Analytics = require('../../models/manager/Analytics');
const AuditLog = require('../../models/superadmin/AuditLog');
const TenantSettings = require('../../models/tenant/Settings');
const Notification = require('../../models/tenant/Notification');

// @desc    Get all tenants/companies
// @route   GET /api/superadmin/companies
// @access  Private/SuperAdmin
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 }).populate('subscription.planId').lean();
    
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
  const { name, domain, adminEmail, password, plan, planId, industry } = req.body;

  try {
    // 0. Fetch Subscription details once if planId is provided
    let dbSub = null;
    if (planId && mongoose.Types.ObjectId.isValid(planId)) {
      dbSub = await Subscription.findById(planId);
    } else if (plan) {
      dbSub = await Subscription.findOne({ name: plan, isActive: true });
    }

    // Determine employee limit and features based on DB or provided plan name
    let employeeLimit = dbSub ? dbSub.employeeLimit : 50;
    if (!dbSub && plan) {
      const planLimits = { basic: 10, premium: 50, enterprise: 1000 };
      employeeLimit = planLimits[plan?.toLowerCase()] || 50;
    }

    // 1. Create Tenant
    const tenant = await Tenant.create({
      name,
      domain,
      industry: industry || 'Technology',
      subscription: {
        planId: dbSub ? dbSub._id : null,
        plan: dbSub ? dbSub.name : (plan || 'basic'),
        status: 'active',
        employeeLimit
      }
    });

    // 2. Create Tenant Admin User (password is auto-hashed by User model's pre-save hook)
    // Synchronize the subscription object for the tenant admin user
    const adminUser = await User.create({
      name: `${name} Admin`,
      email: adminEmail,
      password: password || 'admin123',
      role: 'tenant',
      company: name,
      tenant: tenant._id,
      subscription: {
        plan: dbSub ? dbSub.name : (plan || 'basic'),
        status: 'active',
        price: dbSub ? Number(dbSub.price || 0) : 0,
        startDate: new Date(),
        employeeLimit,
        features: dbSub ? dbSub.features || [] : []
      }
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
  const { name, domain, industry, plan, planId } = req.body;
  
  try {
    const updateData = { name, domain, industry };
    
    if (plan || planId) {
      let employeeLimit = 50;
      if (planId) {
        const sub = await Subscription.findById(planId);
        if (sub) employeeLimit = sub.employeeLimit;
      } else {
        const planLimits = { basic: 10, premium: 50, enterprise: 1000 };
        employeeLimit = planLimits[plan?.toLowerCase()] || 50;
      }

      updateData.subscription = {
        planId: planId || null,
        plan: plan || 'basic',
        employeeLimit
      };
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true }
    );
    
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    // Sync subscription update to the Tenant Admin User
    if (updateData.subscription) {
      const subDetails = updateData.subscription;
      let dbSub = null;
      if (subDetails.planId && mongoose.Types.ObjectId.isValid(subDetails.planId)) {
        dbSub = await Subscription.findById(subDetails.planId);
      } else if (subDetails.plan) {
        dbSub = await Subscription.findOne({ name: subDetails.plan, isActive: true });
      }

      await User.findOneAndUpdate(
        { tenant: tenant._id, role: 'tenant' },
        { 
          $set: { 
            "subscription.plan": subDetails.plan,
            "subscription.employeeLimit": subDetails.employeeLimit,
            "subscription.price": dbSub ? Number(dbSub.price) : 0,
            "subscription.features": dbSub ? dbSub.features : []
          } 
        }
      );
    }
    
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
    const tenantId = req.params.id;
    const tenant = await Tenant.findByIdAndDelete(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    
    // 1. Gather all users belonging to this tenant to delete user-specific data (like Notifications)
    const users = await User.find({ tenant: tenantId }).select('_id');
    const userIds = users.map(u => u._id);

    // 2. Perform Deep Deletion concurrently across all affected collections
    await Promise.all([
      User.deleteMany({ tenant: tenantId }),
      TenantSettings.deleteMany({ tenantId: tenantId }),
      Document.deleteMany({ tenant: tenantId }),
      SupplierVisit.deleteMany({ tenant: tenantId }),
      StoreVisit.deleteMany({ tenant: tenantId }),
      TrackingSession.deleteMany({ tenant: tenantId }),
      Location.deleteMany({ tenant: tenantId }),
      EmployeeDashboard.deleteMany({ tenant: tenantId }),
      ActivityLog.deleteMany({ tenant: tenantId }),
      Task.deleteMany({ tenant: tenantId }),
      Order.deleteMany({ tenant: tenantId }),
      Profile.deleteMany({ tenant: tenantId }),
      Collaboration.deleteMany({ tenant: tenantId }),
      ManagerOrder.deleteMany({ tenant: tenantId }),
      Analytics.deleteMany({ tenant: tenantId }),
      AuditLog.deleteMany({ tenant: tenantId }),
      Notification.deleteMany({ recipient: { $in: userIds } })
    ]);
    
    res.json({ message: 'Tenant and all associated data records deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
