const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../../controllers/superadmin/settingsController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
