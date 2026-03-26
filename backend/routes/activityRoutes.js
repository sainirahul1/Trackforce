const express = require('express');
const router = express.Router();
const { 
  getActivities, 
  createActivity, 
  getExecutives, 
  getLogsByUser 
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

// Main dashboard routes
router.get('/executives', getExecutives);
router.get('/user/:userId', getLogsByUser);
router.get('/', getActivities);
router.post('/', createActivity);

module.exports = router;
