const express = require('express');
const router = express.Router();
const {
  getFollowUps,
  getFollowUpById,
  createFollowUp,
  addHistoryEntry,
  updateFollowUp
} = require('../../controllers/manager/followUpController');

router.get('/', getFollowUps);
router.get('/:id', getFollowUpById);
router.post('/', createFollowUp);
router.post('/:id/history', addHistoryEntry);
router.put('/:id', updateFollowUp);

module.exports = router;
