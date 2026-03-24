const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Task = require('./models/employee/Task');
const User = require('./models/tenant/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const testTaskReassign = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find any employee from ReatchAll
    const employee = await User.findOne({ name: 'ReatchAll Employee' });
    if (!employee) throw new Error('Employee not found');
    console.log('Found employee:', employee._id);

    // Find any manager from ReatchAll
    const manager = await User.findOne({ name: 'ReatchAll Manager' });
    if (!manager) throw new Error('Manager not found');
    console.log('Found manager:', manager._id);

    // Find a task
    let task = await Task.findOne();
    if (!task) throw new Error('Task not found');
    console.log('Found task:', task._id, 'Currently assigned to:', task.employee);

    // Try simulating findByIdAndUpdate
    const updated = await Task.findByIdAndUpdate(task._id, { employee: manager._id }, { new: true });
    console.log('After findByIdAndUpdate:', updated.employee);

    const populated = await Task.findById(task._id).populate('employee', 'name email');
    console.log('After populate:', populated.employee);

    // Reset back
    await Task.findByIdAndUpdate(task._id, { employee: employee._id });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
testTaskReassign();
