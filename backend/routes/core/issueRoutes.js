const express = require('express');
const router = express.Router();
const issueController = require('../../controllers/core/issueController');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.post('/', issueController.createIssue);
router.get('/', issueController.getIssues);
router.get('/:id', issueController.getIssueById);
router.put('/:id', issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);

module.exports = router;
