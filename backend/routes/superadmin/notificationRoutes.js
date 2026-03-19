const express = require('express');
const router = express.Router();
const { broadcastNotification, getBroadcastHistory } = require('../../controllers/superadmin/notificationController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getBroadcastHistory);
router.post('/broadcast', broadcastNotification);

module.exports = router;
