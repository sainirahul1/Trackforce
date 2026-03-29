const express = require('express');
const router = express.Router();
const { startTracking, stopTracking } = require('../../controllers/employee/trackingController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

router.post('/start', startTracking);
router.post('/stop', stopTracking);

module.exports = router;
