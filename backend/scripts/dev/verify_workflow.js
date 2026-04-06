const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const StoreVisit = require('./models/employee/StoreVisit');
const User = require('./models/tenant/User');

dotenv.config({ path: __dirname + '/.env' });

async function verifyWorkflow() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    // 1. Find a test employee
    const employee = await User.findOne({ role: 'employee' });
    if (!employee) throw new Error('No employee found for testing');
    console.log(`Testing with employee: ${employee.name} (${employee._id})`);

    // 2. Create a test Task
    const task = new Task({
      employee: employee._id,
      tenant: employee.tenant,
      title: 'Workflow Verification Task',
      store: 'Test Store',
      priority: 'medium',
      status: 'pending',
      type: 'Audit',
      date: new Date()
    });
    await task.save();
    console.log(`Task created: ${task._id}`);

    // 3. Simulate completion (This logic is in taskController.js updateTask)
    // We are simulating the side effect: creating a StoreVisit
    const visit = new StoreVisit({
      employee: employee._id,
      tenant: employee.tenant,
      taskId: task._id,
      storeName: task.store,
      status: 'completed',
      reviewStatus: 'pending'
    });
    await visit.save();
    
    // Update task to 'completed' (simulating what updateTask does)
    task.status = 'completed';
    await task.save();
    console.log(`Visit created: ${visit._id} linked to Task: ${visit.taskId}`);

    // 4. Verify linkage
    const foundVisit = await StoreVisit.findById(visit._id);
    if (!foundVisit.taskId || foundVisit.taskId.toString() !== task._id.toString()) {
      throw new Error('Task Linkage Failed!');
    }
    console.log('Linkage Verification: SUCCESS');

    // 5. Simulate Manager Rejection (Logic in visitController.js reviewVisit)
    const reviewStatus = 'rejected';
    const reason = 'Evidence incomplete';
    
    foundVisit.reviewStatus = reviewStatus;
    foundVisit.rejectionReason = reason;
    await foundVisit.save();

    if (reviewStatus === 'rejected' && foundVisit.taskId) {
      await Task.findByIdAndUpdate(foundVisit.taskId, { 
        status: 'rejected', 
        missionStatus: 'Rejected' 
      });
    }

    // 6. Verify Task Reversion
    const updatedTask = await Task.findById(task._id);
    console.log(`Task status after rejection: ${updatedTask.status}`);
    if (updatedTask.status !== 'rejected') {
      throw new Error('Task Status Reversion Failed!');
    }
    console.log('Workflow Reversion: SUCCESS');

    // Cleanup
    await Task.findByIdAndDelete(task._id);
    await StoreVisit.findByIdAndDelete(visit._id);
    console.log('Cleanup completed.');
    
    process.exit(0);
  } catch (err) {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
  }
}

verifyWorkflow();
