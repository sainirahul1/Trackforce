const express = require('express');
const router = express.Router();
const { getDashboardStats, getManagerDashboardStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/manager-dashboard', getManagerDashboardStats);

module.exports = router;
