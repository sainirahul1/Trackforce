const Task = require('../../models/employee/Task');
const StoreVisit = require('../../models/employee/StoreVisit');

exports.getTasks = async (req, res) => {
  try {
    console.log(`[DEBUG] Fetching lean tasks for tenant: ${req.tenantId}`);
    const query = { tenant: req.tenantId };
    
    // If the user is an employee, only show their own tasks
    if (req.user && req.user.role === 'employee') {
      query.employee = req.user._id;
    }

    const tasks = await Task.find(query)
    .select('-evidence -checklist')
    .populate('employee', 'name email')
    .sort({ date: -1 });
    
    console.log(`[DEBUG] Found ${tasks.length} lean tasks for tenant: ${req.tenantId}`);
    
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
        gps: { lat: updatedTask.coords?.x || 0, lng: updatedTask.coords?.y || 0 },
        photos: photos,
        notes: updatedTask.visitNotes || `${req.body.missionStatus} - Task: ${updatedTask.title}`,
        taskTitle: updatedTask.title,
        taskType: updatedTask.type,
        checklist: updatedTask.checklist,
        timestamp: new Date()
      });

      console.log(`[WORKFLOW] Created StoreVisit (${visitStatus}) for task: ${updatedTask.title}`);

      // Mark the original task as completed because the visit attempt was finalized
      await Task.findByIdAndUpdate(updatedTask._id, { status: 'completed' });

      // If not fully completed, create a NEW task for 24h later (instead of reusing the old one with old evidence)
      if (req.body.missionStatus !== 'Complete' && req.body.status !== 'completed') {
        const nextDay = new Date();
        nextDay.setHours(nextDay.getHours() + 24);
        
        await Task.create({
          employee: updatedTask.employee,
          tenant: updatedTask.tenant,
          title: updatedTask.title + ' (Follow Up)',
          store: updatedTask.store,
          companyName: updatedTask.companyName,
          companyContact: updatedTask.companyContact,
          companyEmail: updatedTask.companyEmail,
          companyInsight: updatedTask.companyInsight,
          companyDescription: updatedTask.companyDescription,
          address: updatedTask.address,
          distance: updatedTask.distance,
          distanceVal: updatedTask.distanceVal,
          eta: updatedTask.eta,
          priority: updatedTask.priority,
          date: nextDay,
          dueDate: 'Tomorrow',
          type: updatedTask.type,
          coords: updatedTask.coords,
          status: 'pending',
          isTaskStarted: false,
          visitStatus: 'Pending',
          missionStatus: 'Pending',
          checklist: updatedTask.checklist.map(c => ({ id: c.id, text: c.text, completed: false }))
        });
        console.log(`[WORKFLOW] Created new Follow Up task for: ${nextDay}`);
      }
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
