const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../../controllers/employee/taskController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');
const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;
