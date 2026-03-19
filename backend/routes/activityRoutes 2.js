const express = require('express');
const router = express.Router();
const { getActivities, createActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

router.get('/', getActivities);
router.post('/', createActivity);

module.exports = router;
