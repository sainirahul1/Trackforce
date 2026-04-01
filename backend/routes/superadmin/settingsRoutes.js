const express = require('express');
const router = express.Router();
const { 
  getSettings, 
  updateSettings, 
  getDatabaseAnalytics,
  getDuplicates,
  cleanupDuplicates
} = require('../../controllers/superadmin/settingsController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getSettings);
router.get('/analytics', getDatabaseAnalytics);
router.get('/duplicates', getDuplicates);
router.post('/cleanup', cleanupDuplicates);
router.put('/', updateSettings);

module.exports = router;
