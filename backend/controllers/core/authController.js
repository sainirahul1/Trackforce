const User = require('../../models/tenant/User');
const jwt = require('jsonwebtoken');
const { logActivity } = require('../../utils/activityLogger');

// Generate JWT with metadata to reduce middleware DB hits
const generateToken = (id, role, tenant, name, email) => {
  return jwt.sign({ id, role, tenant, name, email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, company, email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let tenantId = null;

    // If registering as a tenant admin, create a new Tenant/Organization
    if (role === 'tenant') {
      const Tenant = require('../../models/superadmin/Tenant');
      const tenant = await Tenant.create({ name: company });
      tenantId = tenant._id;
    }

    const user = await User.create({
      name,
      company,
      email: normalizedEmail,
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
        profile: user.profile || {},
        token: generateToken(user._id, user.role, user.tenant, user.name, user.email),
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
    // Exclude profileImage (base64, can be 500KB–2MB) for fast response
    const user = await User.findById(req.user.id)
      .select('-profile.profileImage')
      .populate('tenant');
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
      // Flag so frontend knows avatar exists without sending the image bytes
      hasProfileImage: !!(user.profile?.profileImage),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password, portal } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    // EXCLUDE large profile image from initial login fetch to speed up auth
    const user = await User.findOne({ email: normalizedEmail })
      .select('-profile.profileImage')
      .populate('tenant');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ──────────────────────────────────────────────────────────
    // STRICT PORTAL VALIDATION (NON-NEGOTIABLE)
    // Map the portal identifier from the frontend to the DB role
    // ──────────────────────────────────────────────────────────
    if (portal) {
      const portalToRoleMap = {
        'EMPLOYEE': 'employee',
        'MANAGER': 'manager',
        'TENANT': 'tenant',
        'SUPER_ADMIN': 'superadmin',
      };
      const expectedRole = portalToRoleMap[portal];

      if (expectedRole && user.role !== expectedRole) {
        console.warn(`[SECURITY] Portal mismatch: User '${user.email}' (role: ${user.role}) tried to login via '${portal}' portal.`);
        return res.status(403).json({ 
          message: `Access denied. You do not have permission to access the ${portal.replace('_', ' ')} portal.` 
        });
      }
    }

    // Log Activity (Backend-only source)
    if (user.role === 'employee') {
      try {
        await logActivity({
          userId: user._id,
          tenantId: user.tenant?._id || user.tenant,
          type: 'login',
          title: 'Portal Access',
          details: 'Employee logged into the system.',
          status: 'success'
        });
      } catch (logErr) {
        console.error('[LOGIN LOG ERROR]', logErr.message);
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      tenant: user.tenant,
      tenantStatus: user.tenant?.onboardingStatus || 'active',
      isDeactivated: user.isDeactivated,
      profile: user.profile || {},
      token: generateToken(user._id, user.role, user.tenant?._id || user.tenant, user.name, user.email),
    });
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
      user.company = req.body.company !== undefined ? req.body.company : user.company;
      if (req.body.email) {
        user.email = req.body.email; // allow email update
      }

      // Update nested profile properties
      user.profile = {
        ...user.profile,
        designation: req.body.designation !== undefined ? req.body.designation : user.profile?.designation,
        phone: req.body.phone !== undefined ? req.body.phone : user.profile?.phone,
        address: req.body.address !== undefined ? req.body.address : user.profile?.address,
        dob: req.body.dob !== undefined ? req.body.dob : user.profile?.dob,
        gender: req.body.gender !== undefined ? req.body.gender : user.profile?.gender,
        nationality: req.body.nationality !== undefined ? req.body.nationality : user.profile?.nationality,
        bloodGroup: req.body.bloodGroup !== undefined ? req.body.bloodGroup : user.profile?.bloodGroup,
        emergencyContact: req.body.emergencyContact !== undefined ? req.body.emergencyContact : user.profile?.emergencyContact,
        allergies: req.body.allergies !== undefined ? req.body.allergies : user.profile?.allergies,
        location: req.body.location !== undefined ? req.body.location : user.profile?.location,
        department: req.body.department !== undefined ? req.body.department : user.profile?.department,
      };

      user.markModified('profile');
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        company: updatedUser.company,
        profile: updatedUser.profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile image
// @route   PUT /api/auth/profile-image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert buffer to Base64 string
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    user.profile.profileImage = base64Image;
    await user.save();

    // Sync with Employee Profile model if it exists
    try {
      const Profile = require('../../models/employee/Profile');
      await Profile.findOneAndUpdate(
        { employeeId: user._id },
        { $set: { avatar: base64Image } },
        { returnDocument: 'after' }
      );
    } catch (profileError) {
      // Profile might not exist for non-employee roles, ignore or log
      console.log('Skipping employee profile sync for non-employee role');
    }

    res.json({
      message: 'Profile image uploaded successfully to database',
      profileImage: base64Image
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user and record activity
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    if (req.user && req.user.role === 'employee') {
      await logActivity({
        userId: req.user._id,
        tenantId: req.user.tenant?._id || req.user.tenant,
        type: 'logout',
        title: 'Session Ended',
        details: 'Employee logged out of the system.',
        status: 'default'
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
