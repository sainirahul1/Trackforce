const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/tenant/User'); // Required for populate
const Task = require('./models/employee/Task');

dotenv.config();

const checkTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const tasks = await Task.find({}).populate('employee', 'name email').lean();
        console.log(JSON.stringify(tasks, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTasks();
