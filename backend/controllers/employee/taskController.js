const Task = require('../../models/employee/Task');
const StoreVisit = require('../../models/employee/StoreVisit');
const { logActivity } = require('../../utils/activityLogger');

exports.getTasks = async (req, res) => {
  try {
    const query = { tenant: req.tenantId };
    
    // If the user is an employee, only show their own tasks
    if (req.user && req.user.role === 'employee') {
      query.employee = req.user._id;
    }

    const tasks = await Task.find(query)
    .select('-checklist')
    .populate('employee', 'name email')
    .sort({ date: -1 })
    .lean();
    
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task details
// @route   GET /api/employee/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, tenant: req.tenantId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task details by ID (alternative)
// @route   GET /api/employee/tasks/detail/:id
// @access  Private
exports.getTaskDetail = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, tenant: req.tenantId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/employee/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const isManager = req.user && (req.user.role === 'manager' || req.user.role === 'superadmin');
    
    const taskData = {
      ...req.body,
      // If manager/superadmin, use provided employee; otherwise, use current user
      employee: isManager && req.body.employee ? req.body.employee : req.user._id,
      tenant: req.tenantId,
    };

    const task = await Task.create(taskData);
    const populatedTask = await Task.findById(task._id).populate('employee', 'name email');

    // NEW: Log Activity & Notify Employee
    await logActivity({
      userId: taskData.employee,
      tenantId: taskData.tenant,
      type: 'task_assigned',
      title: 'New Mission Assigned',
      details: `Project "${taskData.title}" assigned to you at ${taskData.store}.`,
      status: taskData.priority === 'high' ? 'urgent' : 'info',
      metadata: { taskId: task._id, store: taskData.store },
      notify: true,
      priority: taskData.priority === 'high' ? 'high' : 'medium'
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PATCH /api/employee/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    // First, find the task to ensure it exists and belongs to the tenant
    const task = await Task.findOne({ _id: req.params.id, tenant: req.tenantId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Terminal State Protection: Do not allow further updates to finalized tasks
    if (['completed', 'rejected', 'cancelled'].includes(task.status)) {
      return res.status(400).json({ message: `Mission is already in a terminal state (${task.status}) and cannot be modified.` });
    }

    // Update the task first
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task failed to update' });
    }

    // Workflow Extension: Only trigger for employees or when a task is explicitly "finished"
    const isEmployee = req.user && req.user.role === 'employee';
    const isFinishing = (req.body.status === 'completed' || ['Complete', 'Follow Up', 'Rejected'].includes(req.body.missionStatus));
    
    if (isEmployee && isFinishing) {
      const photos = [];
      if (updatedTask.evidence) {
        if (updatedTask.evidence.storeFront) photos.push(updatedTask.evidence.storeFront);
        if (updatedTask.evidence.selfie) photos.push(updatedTask.evidence.selfie);
        if (updatedTask.evidence.productDisplay) photos.push(updatedTask.evidence.productDisplay);
        if (updatedTask.evidence.officialDoc) photos.push(updatedTask.evidence.officialDoc);
      }

      // Map missionStatus to StoreVisit status
      let visitStatus = 'completed';
      if (req.body.missionStatus === 'Follow Up') visitStatus = 'follow_up';
      if (req.body.missionStatus === 'Rejected') visitStatus = 'not_interested';

      await StoreVisit.create({
        employee: updatedTask.employee,
        tenant: updatedTask.tenant,
        storeName: updatedTask.store,
        address: updatedTask.address,
        distance: updatedTask.distance,
        eta: updatedTask.eta,
        status: visitStatus,
        taskId: updatedTask._id,
        gps: { lat: updatedTask.coords?.x || 0, lng: updatedTask.coords?.y || 0 },
        photos: photos,
        notes: updatedTask.visitNotes || `${req.body.missionStatus} - Task: ${updatedTask.title}`,
        taskTitle: updatedTask.title,
        taskType: updatedTask.type,
        checklist: updatedTask.checklist,
        timestamp: new Date()
      });

    // Mark the original task as completed because the visit attempt was finalized
    await Task.findByIdAndUpdate(updatedTask._id, { status: 'completed' });

    // NEW: Log Activity for completion/terminal states
    let activityType = 'task_completed';
    let activityStatus = 'success';
    let activityTitle = 'Mission Finalized';
    
    if (req.body.missionStatus === 'Follow Up') {
      activityType = 'task_followup';
      activityStatus = 'info';
      activityTitle = 'Follow-up Scheduled';
    } else if (req.body.missionStatus === 'Rejected') {
      activityType = 'task_rejected';
      activityStatus = 'warning';
      activityTitle = 'Mission Rejected';
    }

    await logActivity({
      userId: req.user._id,
      tenantId: req.tenantId,
      type: activityType,
      title: activityTitle,
      details: `Employee finalized mission "${updatedTask.title}" at ${updatedTask.store} with status: ${req.body.missionStatus}.`,
      status: activityStatus,
      metadata: { taskId: updatedTask._id, missionStatus: req.body.missionStatus }
    });
  } else if (req.body.isTaskStarted && !task.isTaskStarted) {
    // NEW: Log task start
    await logActivity({
      userId: req.user._id,
      tenantId: req.tenantId,
      type: 'task_started',
      title: 'Mission Started',
      details: `Employee started mission "${updatedTask.title}" at ${updatedTask.store}.`,
      status: 'success',
      metadata: { taskId: updatedTask._id }
    });
  } else if (req.body.status === 'delayed' && task.status !== 'delayed') {
    // NEW: Log delay
    await logActivity({
      userId: req.user._id,
      tenantId: req.tenantId,
      type: 'task_delayed',
      title: 'Mission Delayed',
      details: `Mission "${updatedTask.title}" at ${updatedTask.store} has been marked as delayed.`,
      status: 'warning',
      metadata: { taskId: updatedTask._id }
    });
  }

    // Return the updated task with populated employee name
    const populatedTask = await Task.findById(updatedTask._id).populate('employee', 'name email');
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/employee/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      tenant: req.tenantId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
