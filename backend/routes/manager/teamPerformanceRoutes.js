const express = require('express');
const router = express.Router();
const { getTeamPerformance } = require('../../controllers/manager/teamPerformanceController');
const { protect } = require('../../middleware/authMiddleware');
const validateRole = require('../../middleware/validateRole');

router.use(protect);
router.use(validateRole('manager', 'superadmin'));

router.get('/', getTeamPerformance);

module.exports = router;
