const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models
const User = require('../models/tenant/User');
const Tenant = require('../models/superadmin/Tenant');
const Task = require('../models/employee/Task');
const StoreVisit = require('../models/employee/StoreVisit');
const SupplierVisit = require('../models/employee/SupplierVisit');
const Order = require('../models/employee/Order');
const Permission = require('../models/superadmin/Permission');
const Location = require('../models/employee/Location');
const ActivityLog = require('../models/employee/ActivityLog');
const TrackingSession = require('../models/employee/TrackingSession');
const Notification = require('../models/tenant/Notification');
const Collaboration = require('../models/manager/Collaboration');

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const tasks = {
    'check-tasks': async () => {
        await connectDB();
        const tasks = await Task.find({});
        console.log('Total Tasks in DB:', tasks.length);
        tasks.forEach(t => {
            console.log(`- ${t.title} (${t.store}) - Employee: ${t.employee}`);
        });
    },

    'check-indexes': async () => {
        await connectDB();
        console.log('\n--- STORE VISITS INDEXES ---');
        console.log(await StoreVisit.listIndexes());
        console.log('\n--- TASKS INDEXES ---');
        console.log(await Task.listIndexes());
    },

    'check-tenants': async () => {
        await connectDB();
        const tasks = await Task.find({});
        console.log(JSON.stringify(tasks.map(t => ({ title: t.title, tenant: t.tenant, employee: t.employee })), null, 2));
    },

    'check-user-tenants': async () => {
        await connectDB();
        const employees = await User.find({ role: 'employee' });
        console.log(`\n--- EMPLOYEES (${employees.length}) ---`);
        employees.forEach(u => {
            console.log(`Emp: ${u.name} (${u.email}) | Tenant: ${u.tenant} | ID: ${u._id}`);
        });

        const visitCountByTenant = await StoreVisit.aggregate([
            { $group: { _id: "$tenant", count: { $sum: 1 } } }
        ]);
        console.log('\n--- VISITS BY TENANT ---');
        console.log(visitCountByTenant);
    },

    'check-user': async () => {
        await connectDB();
        const user = await User.findById('69bd05f66a0c7053c7baa200');
        if (user) {
            console.log('USER_EXISTS=true');
            console.log('TENANT_ID=' + user.tenant);
        } else {
            console.log('USER_EXISTS=false');
        }
    },

    'check-visits': async () => {
        await connectDB();
        const visitCount = await StoreVisit.countDocuments({});
        console.log(`\n--- STORE VISITS (${visitCount}) ---`);
        const visits = await StoreVisit.find({}).limit(5);
        visits.forEach((v, i) => {
            console.log(`Visit ${i + 1}: ${v.storeName} | Status: ${v.status}`);
        });

        const taskCount = await Task.countDocuments({});
        console.log(`\n--- TASKS (${taskCount}) ---`);
        const tasksWithEvidence = await Task.find({
            $or: [
                { 'evidence.storeFront': { $exists: true, $ne: null } },
                { 'evidence.selfie': { $exists: true, $ne: null } }
            ]
        }).limit(5);
        console.log(`Found ${tasksWithEvidence.length} tasks with evidence samples`);
    },

    'check-settings': async () => {
        await connectDB();
        const db = mongoose.connection.db;
        const settings = await db.collection('superadmin.settings').find({}).toArray();
        console.log("Settings docs:", settings);
    },

    'find-ids': async () => {
        await connectDB();
        const users = await User.find({ role: 'employee' }).limit(1);
        const tenants = await Tenant.find({}).limit(1);
        if (users.length > 0) {
            console.log('EMPLOYEE_ID=' + users[0]._id);
            console.log('TENANT_ID=' + users[0].tenant);
        } else {
            console.log('No employees found.');
        }
    },

    'set-maintenance': async () => {
        await connectDB();
        const db = mongoose.connection.db;
        await db.collection('superadmin.settings').updateOne({}, { $set: { maintenanceMode: true } });
        console.log("Platform set to Maintenance Mode: true");
    },

    'test-auth': async () => {
        console.log('--- Testing Auth API (Requires Server on 5001) ---');
        const API_URL = 'http://localhost:5001/api/auth';
        try {
            const regRes = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Test User', company: 'Test', email: 'test@example.com', password: 'password', role: 'superadmin' })
            });
            console.log('Register Response Status:', regRes.status);
        } catch (err) {
            console.error('Test Auth Error:', err.message);
        }
    },

    'test-put': async () => {
        await connectDB();
        const db = mongoose.connection.db;
        const user = await db.collection('tenant.users').findOne({ role: 'superadmin' });
        if (!user) {
            console.log("No superadmin found.");
            return;
        }
        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Generated token for superadmin. Run fetch to test PUT /api/superadmin/settings.');
    },

    'unify-tenants': async () => {
        await connectDB();
        const result = await Task.updateMany({}, { tenant: '69c0fbbe60763acca36b8dbe' });
        console.log(`Updated ${result.modifiedCount} tasks to unified tenant.`);
    },

    'validate-models': async () => {
        console.log('--- SaaS Model Validation ---');
        const models = { Tenant, User, Location, ActivityLog, TrackingSession, StoreVisit, SupplierVisit, Collaboration, Order, Notification };
        for (const [name, model] of Object.entries(models)) {
            console.log(model ? `✅ ${name} loaded.` : `❌ Error loading ${name}.`);
        }
    }
};

const showHelp = () => {
    console.log('\n🛠  TrackForce Admin Toolbox');
    console.log('Usage: node scripts/toolbox.js <command>\n');
    console.log('Available Commands:');
    Object.keys(tasks).forEach(cmd => console.log(`  - ${cmd}`));
    console.log('\n');
};

const main = async () => {
    const cmd = process.argv[2];
    if (!cmd || !tasks[cmd]) {
        showHelp();
        process.exit(0);
    }

    try {
        await tasks[cmd]();
        console.log('\n✨ Task completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('\n💥 Task failed:', err.message);
        process.exit(1);
    }
};

main();
