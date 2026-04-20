const express = require('express');
const router = express.Router();
const {
  setTarget,
  getTargetHistory,
  getTargetsOverview
} = require('../../controllers/manager/targetController');

router.get('/employees', getTargetsOverview);
router.get('/history/:employeeId', getTargetHistory);
router.post('/', setTarget);

module.exports = router;
