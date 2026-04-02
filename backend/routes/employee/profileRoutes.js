const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    getMyAvatar,
    updateMyProfile,
    updateSettings,
    changePassword,
} = require('../../controllers/employee/profileController');
// Parent employeeRoutes.js handles protect, tenantMiddleware, and employee auth.

// Profile (avatar excluded for speed)
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// Avatar - dedicated lightweight endpoint, independently cacheable
router.get('/avatar', getMyAvatar);

// Settings
router.put('/settings', updateSettings);

// Password
router.put('/password', changePassword);

module.exports = router;
