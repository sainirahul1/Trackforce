const express = require('express');
const router = express.Router();
const SystemSetting = require('../../models/superadmin/SystemSetting');

// @desc    Get public system settings (like maintenance mode)
// @route   GET /api/public/settings
// @access  Public
router.get('/settings', async (req, res) => {
  try {
    let settings = await SystemSetting.findOne().select('maintenanceMode platformName');
    
    // If no settings document exists yet, return default
    if (!settings) {
      settings = { maintenanceMode: false, platformName: 'TrackForce SaaS' };
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Server error fetching public settings' });
  }
});

module.exports = router;
