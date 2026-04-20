const express = require('express');
const router = express.Router();
const { getEmployeeFollowUps, addHistoryEntry } = require('../../controllers/employee/followUpController');

router.get('/', getEmployeeFollowUps);
router.post('/:id/history', addHistoryEntry);

module.exports = router;
