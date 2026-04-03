const Profile = require('../../models/employee/Profile');
const User = require('../../models/tenant/User');

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    // Exclude avatar (base64, can be 500KB–2MB) from main profile fetch for speed.
    // Avatar is served by the dedicated GET /avatar endpoint.
    let profile = await Profile.findOne({ employeeId: req.user._id })
      .select('-avatar')
      .lean();

    if (!profile) {
      // Safety: If name or email are missing from fast-path token, fetch from User
      let name = req.user.name;
      let email = req.user.email;
      
      if (!name || !email) {
        const user = await User.findById(req.user._id).select('name email profile').lean();
        name = name || user?.name || '';
        email = email || user?.email || '';
      }

      const created = await Profile.create({
        employeeId: req.user._id,
        name: name || 'Unknown User',
        email: email || `user_${req.user._id}@trackforce.com`,
        phone: req.user.phone || '',
        designation: req.user.designation || '',
        team: req.user.team || '',
        location: req.user.location || '',
        avatar: req.user.avatar || '',
      });
      // Return without avatar
      const { avatar: _a, ...profileWithoutAvatar } = created.toObject();
      return res.json(profileWithoutAvatar);
    }

    res.json(profile);
  } catch (error) {
    console.error('getMyProfile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's avatar only (lightweight, cacheable)
// @route   GET /api/employee/profile/avatar
// @access  Private
const getMyAvatar = async (req, res) => {
  try {
    const profile = await Profile.findOne({ employeeId: req.user._id })
      .select('avatar email')
      .lean();

    // Also check User model's profileImage as a fallback
    let avatar = profile?.avatar || '';
    if (!avatar) {
      const user = await User.findById(req.user._id).select('profile.profileImage').lean();
      avatar = user?.profile?.profileImage || '';
    }

    // Set long-lived cache headers since the avatar only changes on explicit upload
    res.set('Cache-Control', 'private, max-age=86400'); // 24 hours
    res.json({ avatar });
  } catch (error) {
    console.error('getMyAvatar error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/profile/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'email', 'phone', 'location', 'address',
      'gender', 'nationality', 'dob', 'bloodGroup',
      'emergencyContact', 'allergies', 'avatar',
      'designation', 'team', 'status',
      'employeeCode', 'dateOfJoin', 'workArea',
      'reportingTo', 'securityLevel'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let profile = await Profile.findOneAndUpdate(
      { employeeId: req.user._id },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!profile) {
      profile = await Profile.create({
        employeeId: req.user._id,
        ...updates,
      });
    }

    // Sync with User model (tenant.users collection)
    const userUpdates = {
      name: updates.name,
      email: updates.email,
      profile: {
        designation: updates.designation,
        phone: updates.phone,
        address: updates.address,
        dob: updates.dob,
        gender: updates.gender,
        nationality: updates.nationality,
        bloodGroup: updates.bloodGroup,
        emergencyContact: updates.emergencyContact,
        allergies: updates.allergies,
        location: updates.location,
        employeeCode: updates.employeeCode,
        dateOfJoin: updates.dateOfJoin,
        workArea: updates.workArea,
        reportingTo: updates.reportingTo,
        securityLevel: updates.securityLevel,
        profileImage: updates.avatar, // Mapping avatar to profileImage
      }
    };

    // Clean up undefined fields for User update
    Object.keys(userUpdates).forEach(key => userUpdates[key] === undefined && delete userUpdates[key]);
    if (userUpdates.profile) {
      Object.keys(userUpdates.profile).forEach(key => userUpdates.profile[key] === undefined && delete userUpdates.profile[key]);
      // If profile object is empty after cleaning, remove it
      if (Object.keys(userUpdates.profile).length === 0) delete userUpdates.profile;
    }

    await User.findByIdAndUpdate(req.user._id, { $set: userUpdates });

    res.json(profile);
  } catch (error) {
    console.error('updateMyProfile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update profile settings
// @route   PUT /api/profile/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    const settingsFields = [
      'language', 'emailNotifications', 'pushNotifications',
      'shiftReminders', 'orderAlerts', 'weeklyDigest',
      'twoFactorAuth', 'loginAlerts', 'sessionTimeout'
    ];

    const settingsUpdate = {};
    for (const field of settingsFields) {
      if (req.body[field] !== undefined) {
        settingsUpdate[`settings.${field}`] = req.body[field];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { employeeId: req.user._id },
      { $set: settingsUpdate },
      { returnDocument: 'after', runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile.settings);
  } catch (error) {
    console.error('updateSettings error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const User = require('../../models/tenant/User');
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('changePassword error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMyProfile,
  getMyAvatar,
  updateMyProfile,
  updateSettings,
  changePassword,
};
