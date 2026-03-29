const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const ActivityLog = require('./models/employee/ActivityLog');
const User = require('./models/tenant/User');
const Tenant = require('./models/superadmin/Tenant');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedActivityEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding activity events...');

    // Clear existing logs
    await ActivityLog.deleteMany({});
    console.log('Cleared existing activity logs.');

    // Find the ReatchAll tenant and its executives
    const reatchAllTenant = await Tenant.findOne({ name: 'ReatchAll' });
    if (!reatchAllTenant) {
        console.error('ReatchAll tenant not found. Please run main seed script first.');
        process.exit(1);
    }

    const executives = await User.find({ tenant: reatchAllTenant._id, role: 'employee' });
    
    if (executives.length === 0) {
        console.error('No executives found for ReatchAll.');
        process.exit(1);
    }

    const mockEvents = [];
    const now = new Date();

    executives.forEach((exec, index) => {
        // Daily journey for each executive
        const dayOffset = 0; // Today
        
        // 1. Shift Started
        mockEvents.push({
            user: exec._id,
            tenant: reatchAllTenant._id,
            type: 'start_tracking',
            title: 'Shift Started & GPS Locked',
            details: `${exec.name} started their shift at East Side Mall. GPS Active.`,
            status: 'default',
            timestamp: new Date(new Date().setHours(9, 0, 0))
        });

        // 2. Emergency Task (for some)
        if (index % 2 === 0) {
            mockEvents.push({
                user: exec._id,
                tenant: reatchAllTenant._id,
                type: 'task_assigned',
                title: 'Emergency Task Assigned',
                details: 'TSK-102: Immediate meeting with priority client regarding stock delay.',
                status: 'info',
                timestamp: new Date(new Date().setHours(9, 45, 0))
            });
        }

        // 3. High Value Order
        mockEvents.push({
            user: exec._id,
            tenant: reatchAllTenant._id,
            type: 'order_placed',
            title: 'High-Value Order Collected',
            details: `ORD-5522 closed for ₹1.2L with premium client. Verified by ${exec.name}.`,
            status: 'success',
            timestamp: new Date(new Date().setHours(11, 15, 0))
        });

        // 4. Store Visit
        mockEvents.push({
            user: exec._id,
            tenant: reatchAllTenant._id,
            type: 'visit_start',
            title: 'Store Visit Started',
            details: 'Global Tech Solutions HQ - Monthly Audit and Inventory Check.',
            status: 'info',
            timestamp: new Date(new Date().setHours(12, 30, 0))
        });

        mockEvents.push({
            user: exec._id,
            tenant: reatchAllTenant._id,
            type: 'visit_end',
            title: 'Store Visit Completed',
            details: 'Visit completed at Global Tech Solutions. All checks verified.',
            status: 'success',
            timestamp: new Date(new Date().setHours(13, 15, 0))
        });

        // 5. Route Deviation (Alert)
        if (index === 0) { // Specific alert for first executive (John Doe)
            mockEvents.push({
                user: exec._id,
                tenant: reatchAllTenant._id,
                type: 'route_deviation',
                title: 'Route Deviation Detected',
                details: 'Deviated >5km from assigned daily route in West End sector.',
                status: 'warning',
                timestamp: new Date(new Date().setHours(14, 45, 0))
            });
        }

        // 6. Logout / End
        mockEvents.push({
            user: exec._id,
            tenant: reatchAllTenant._id,
            type: 'stop_tracking',
            title: 'Shift Ended',
            details: 'Shift completed. GPS tracking disabled.',
            status: 'default',
            timestamp: new Date(new Date().setHours(18, 0, 0))
        });
    });

    await ActivityLog.insertMany(mockEvents);
    console.log(`Successfully seeded ${mockEvents.length} activity events for ${executives.length} executives.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding activity events:', error);
    process.exit(1);
  }
};

seedActivityEvents();
