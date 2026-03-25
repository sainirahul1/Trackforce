const User = require('../models/tenant/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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
        isDeactivated: user.isDeactivated,
        token: generateToken(user._id),
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
      isDeactivated: user.isDeactivated,
      profile: user.profile || {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const populatedUser = await User.findById(user._id).populate('tenant');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        tenant: user.tenant,
        tenantStatus: populatedUser.tenant?.onboardingStatus || 'active',
        isDeactivated: user.isDeactivated,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;

      // Update nested profile properties
      user.profile = {
        ...user.profile,
        phone: req.body.phone !== undefined ? req.body.phone : user.profile?.phone,
        address: req.body.address !== undefined ? req.body.address : user.profile?.address,
        dob: req.body.dob !== undefined ? req.body.dob : user.profile?.dob,
        gender: req.body.gender !== undefined ? req.body.gender : user.profile?.gender,
        nationality: req.body.nationality !== undefined ? req.body.nationality : user.profile?.nationality,
        bloodGroup: req.body.bloodGroup !== undefined ? req.body.bloodGroup : user.profile?.bloodGroup,
        emergencyContact: req.body.emergencyContact !== undefined ? req.body.emergencyContact : user.profile?.emergencyContact,
        allergies: req.body.allergies !== undefined ? req.body.allergies : user.profile?.allergies,
        location: req.body.location !== undefined ? req.body.location : user.profile?.location,
      };

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
