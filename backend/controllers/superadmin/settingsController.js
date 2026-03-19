const SystemSetting = require('../../models/superadmin/SystemSetting');

// @desc    Get system settings
// @route   GET /api/superadmin/settings
// @access  Private/SuperAdmin
exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/superadmin/settings
// @access  Private/SuperAdmin
exports.updateSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
