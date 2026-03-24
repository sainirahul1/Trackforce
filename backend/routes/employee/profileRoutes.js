const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    updateMyProfile,
    updateSettings,
    addDocument,
    updateDocument,
    deleteDocument,
    changePassword,
} = require('../../controllers/employee/profileController');
// Parent employeeRoutes.js handles protect, tenantMiddleware, and employee auth.

// Profile
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// Settings
router.put('/settings', updateSettings);

// Documents
router.post('/documents', addDocument);
router.put('/documents/:docId', updateDocument);
router.delete('/documents/:docId', deleteDocument);

// Password
router.put('/password', changePassword);

module.exports = router;
