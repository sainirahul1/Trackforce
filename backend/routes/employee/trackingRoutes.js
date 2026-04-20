const express = require('express');
const router = express.Router();
const { 
  startTracking, 
  stopTracking, 
  getActiveSessions, 
  getTrackingStatus,
  ping
} = require('../../controllers/employee/trackingController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

router.get('/active', getActiveSessions);
router.get('/status', getTrackingStatus);
router.post('/start', startTracking);
router.post('/stop', stopTracking);
router.post('/ping', ping);

module.exports = router;
