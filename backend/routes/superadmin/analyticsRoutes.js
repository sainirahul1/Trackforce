const express = require('express');
const router = express.Router();
const { getGlobalStats, getOnboardingGrowth } = require('../../controllers/superadmin/analyticsController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getGlobalStats);
router.get('/growth', getOnboardingGrowth);

module.exports = router;
