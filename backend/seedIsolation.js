const mongoose = require('mongoose');
const User = require('./models/tenant/User');
const Order = require('./models/employee/Order');
const Tenant = require('./models/superadmin/Tenant');
require('dotenv').config();

const seedIsolationData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Create a Test Tenant
        const tenant = await Tenant.create({
            name: 'Isolation Test Corp',
            email: 'test@isolation.com',
            company: 'Isolation Corp'
        });

        // 2. Create a Manager
        const manager = await User.create({
            name: 'Test Manager',
            email: `manager_${Date.now()}@test.com`,
            password: 'password123',
            role: 'manager',
            tenant: tenant._id,
            company: 'Isolation Corp'
        });

        // 3. Create an Employee managed by this Manager
        const employee = await User.create({
            name: 'Team Employee',
            email: `employee_${Date.now()}@test.com`,
            password: 'password123',
            role: 'employee',
            tenant: tenant._id,
            manager: manager._id,
            company: 'Isolation Corp'
        });

        // 4. Create another Manager in the SAME Tenant (Isolation Check)
        const manager2 = await User.create({
            name: 'Manager 2',
            email: `manager2_${Date.now()}@test.com`,
            password: 'password123',
            role: 'manager',
            tenant: tenant._id,
            company: 'Isolation Corp'
        });

        // 5. Create an Order for the Employee
        await Order.create({
            employee: employee._id,
            tenant: tenant._id,
            storeName: 'Isolation Store',
            items: 3,
            totalAmount: 5000,
            status: 'completed',
            timestamp: new Date()
        });

        console.log('Seeding Success:');
        console.log(`- Tenant: ${tenant._id}`);
        console.log(`- Manager 1 (Team): ${manager._id} (email: ${manager.email})`);
        console.log(`- Manager 2 (Others): ${manager2._id} (email: ${manager2.email})`);
        console.log(`- Employee: ${employee._id}`);
        console.log('Manager 1 SHOULD see 1 order (5000 revenue). Manager 2 SHOULD see 0.');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedIsolationData();
