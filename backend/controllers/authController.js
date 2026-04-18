const User = require('../models/tenant/User');
const jwt = require('jsonwebtoken');

// Generate JWT with full role-based claims for Fast-Path Auth
const generateToken = (id, role, tenant) => {
  return jwt.sign({ 
    id, 
    role: role || 'employee', 
    tenant: tenant || null 
  }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, company, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let tenantId = null;

    // If registering as a tenant admin, create a new Tenant/Organization
    if (role === 'tenant') {
      const Tenant = require('../models/superadmin/Tenant');
      const tenant = await Tenant.create({ name: company });
      tenantId = tenant._id;
    }

    const user = await User.create({
      name,
      company,
      email,
      password,
      role: role || 'employee',
      tenant: tenantId,
    });

    if (user) {
      const populatedUser = await User.findById(user._id).populate('tenant');
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        tenant: user.tenant,
        tenantStatus: populatedUser.tenant?.onboardingStatus || 'active',
        manager: user.manager,
        isTracking: user.isTracking,
        isTracking: user.isTracking,
        token: generateToken(user._id, user.role, user.tenant),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('tenant');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      tenant: user.tenant?._id,
      tenantStatus: user.tenant?.onboardingStatus || 'active',
      manager: user.manager,
      isTracking: user.isTracking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password, portal } = req.body;
  console.log('Login attempt:', { email, portal });

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Strict Portal Isolation Logic
      if (portal) {
        const normalizedPortal = portal.toLowerCase().replace('_', '');
        const normalizedRole = user.role.toLowerCase().replace('_', '');

        if (normalizedPortal !== normalizedRole) {
          return res.status(403).json({ 
            message: `Unauthorized: Your ${user.role} account cannot access the ${portal} portal.` 
          });
        }
      }

      const populatedUser = await User.findById(user._id).populate('tenant');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        tenant: populatedUser.tenant?._id || user.tenant,
        tenantStatus: populatedUser.tenant?.onboardingStatus || 'active',
        manager: user.manager,
        isTracking: user.isTracking,
        token: generateToken(user._id, user.role, populatedUser.tenant?._id || user.tenant),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

