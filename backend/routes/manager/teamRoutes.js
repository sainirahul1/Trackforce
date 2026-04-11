const express = require('express');
const router = express.Router();
const {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../../controllers/manager/teamController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantMiddleware);

router.get('/', getTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
