const express = require('express');
const router = express.Router();
const {
  getManagerActivities,
  createManagerActivity
} = require('../../controllers/manager/activityController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

// Manager specific activity endpoints
router.get('/', getManagerActivities);
router.post('/', createManagerActivity);

module.exports = router;
