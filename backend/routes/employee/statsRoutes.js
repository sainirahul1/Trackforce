const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../../controllers/employee/statsController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

router.get('/dashboard', getDashboardStats);

module.exports = router;
