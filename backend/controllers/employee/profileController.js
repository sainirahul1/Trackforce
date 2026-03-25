const Profile = require('../../models/employee/Profile');

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ employeeId: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        employeeId: req.user._id,
        name: req.user.name || '',
        email: req.user.email || '',
        phone: req.user.phone || '',
        designation: req.user.designation || '',
        team: req.user.team || '',
        location: req.user.location || '',
        avatar: req.user.avatar || '',
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('getMyProfile error:', error.message);
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
      { new: true, runValidators: true }
    );

    if (!profile) {
      profile = await Profile.create({
        employeeId: req.user._id,
        ...updates,
      });
    }

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
      { new: true, runValidators: true }
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
  updateMyProfile,
  updateSettings,
  changePassword,
};
