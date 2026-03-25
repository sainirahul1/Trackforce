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

    'inject-orders': async () => {
        await connectDB();
        const user = await User.findOne();
        const tenant = await Tenant.findOne();
        if (!user || !tenant) {
            console.log('No user or tenant found.');
            return;
        }
        const today = new Date();
        const ordersData = [
            { employee: user._id, tenant: tenant._id, storeName: 'Reliance Smart (Dummy Today)', items: 15, totalAmount: 1500, status: 'pending', timestamp: today },
            { employee: user._id, tenant: tenant._id, storeName: 'Global Mart (Dummy 3 days ago)', items: 5, totalAmount: 1000, status: 'completed', timestamp: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000) }
        ];
        await Order.insertMany(ordersData);
        console.log('Successfully inserted 2 dummy orders.');
    },

    'seed-current-user': async () => {
        await connectDB();
        const TARGET_USER_ID = '69bd05f66a0c7053c7baa200';
        const MOCK_TENANT_ID = '69bd05f66a0c7053c7baa000';
        
        let tenant = await Tenant.findById(MOCK_TENANT_ID);
        if (!tenant) {
            await Tenant.create({ _id: MOCK_TENANT_ID, name: 'Mock Deployment Org', industry: 'Retail', subscription: { plan: 'enterprise', status: 'active', employeeLimit: 1000 } });
        }
        
        let user = await User.findById(TARGET_USER_ID);
        if (!user) {
            await User.create({ _id: TARGET_USER_ID, name: 'Active Field Agent', email: 'active@trackforce.com', password: 'password123', role: 'employee', tenant: MOCK_TENANT_ID, company: 'Mock Corp' });
        }
        
        await Task.deleteMany({ employee: TARGET_USER_ID });
        console.log('Seeded current user and mock tenant data.');
    },

    'seed-permissions': async () => {
        await connectDB();
        const defaultPermissions = [
            { module: 'Global System Settings', superAdmin: true, tenant: true, manager: false, employee: false },
            { module: 'Store Visits & Evidence', superAdmin: true, tenant: true, manager: true, employee: true }
        ];
        for (const p of defaultPermissions) {
            await Permission.findOneAndUpdate({ module: p.module }, p, { upsert: true, new: true });
        }
        console.log('Permissions seeded.');
    },

    'seed-tasks': async () => {
        await connectDB();
        const EMPLOYEE_ID = '69c0fbbe60763acca36b8dc4';
        const TENANT_ID = '69c0fbbe60763acca36b8dbe';
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
        
        const tasks = [
            { title: 'Store Inventory Audit', store: 'Big Bazaar Central', employee: EMPLOYEE_ID, tenant: TENANT_ID, date: today, status: 'pending', priority: 'high', type: 'Audit' },
            { title: 'Merchandise Display Setup', store: 'Reliance Fresh', employee: EMPLOYEE_ID, tenant: TENANT_ID, date: today, status: 'in-progress', priority: 'medium', type: 'Retail' }
        ];
        
        await Task.deleteMany({ employee: EMPLOYEE_ID });
        await Task.insertMany(tasks);
        console.log('Seeded sample tasks for employee.');
    },

    'seed-orders': async () => {
        await connectDB();
        const existingOrder = await Order.findOne();
        if (!existingOrder) {
            console.log("No existing orders found to copy refs from.");
            return;
        }
        const dummyOrders = [
            { storeName: "Filter Test Store", items: 5, totalAmount: 1250, status: "completed", employee: existingOrder.employee, tenant: existingOrder.tenant, timestamp: new Date() }
        ];
        await Order.insertMany(dummyOrders);
        console.log("Seeded dummy orders.");
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
