const express = require('express');
const router = express.Router();
const {
  setTarget,
  getTargetHistory,
  getTargetsOverview,
  deleteTarget
} = require('../../controllers/manager/targetController');

router.get('/employees', getTargetsOverview);
router.get('/history/:employeeId', getTargetHistory);
router.post('/', setTarget);
router.delete('/:targetId', deleteTarget);

module.exports = router;
