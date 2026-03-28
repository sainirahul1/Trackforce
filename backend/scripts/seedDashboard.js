const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tenant = require('../models/superadmin/Tenant');
const Subscription = require('../models/superadmin/Subscription');
const User = require('../models/tenant/User');
const AuditLog = require('../models/superadmin/AuditLog');

dotenv.config();

const seedDashboard = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // 1. Create or Update Tenant "TrackForce Enterprise"
        let tenant = await Tenant.findOne({ name: 'TrackForce Enterprise' });
        
        if (!tenant) {
            tenant = new Tenant({
                name: 'TrackForce Enterprise',
                domain: 'trackforce.io',
                onboardingStatus: 'active',
                subscription: {
                    plan: 'Enterprise Nexus',
                    status: 'active',
                    expiry: new Date('2026-12-20'),
                    employeeLimit: 500
                }
            });
            await tenant.save();
            console.log('Created Tenant: TrackForce Enterprise');
        } else {
            tenant.domain = 'trackforce.io';
            tenant.subscription.plan = 'Enterprise Nexus';
            tenant.subscription.expiry = new Date('2026-12-20');
            tenant.subscription.employeeLimit = 500;
            await tenant.save();
            console.log('Updated Tenant: TrackForce Enterprise');
        }

        const tenantId = tenant._id;

        // 2. Seed Managers (Total 32 to match dummy data pagination)
        const managerNames = [
            'Siddharth Malhotra', 'Ananya Rao', 'Vikram Singh', 'Meera Kapoor',
            'Rahul Verma', 'Sneha Gupta', 'Arjun Khanna', 'Priya Sharma',
            'Amit Patel', 'Neha Singh', 'Rohan Mehta', 'Ishani Das',
            'Karan Johar', 'Zoya Akhtar', 'Farhan Akhtar', 'Alia Bhatt',
            'Ranbir Kapoor', 'Shah Rukh Khan', 'Salman Khan', 'Aamir Khan',
            'Hrithik Roshan', 'Deepika Padukone', 'Katrina Kaif', 'Anushka Sharma',
            'Varun Dhawan', 'Sidharth Malhotra', 'Kiara Advani', 'Sara Ali Khan',
            'Kartik Aaryan', 'Janhvi Kapoor', 'Ishaan Khatter', 'Tara Sutaria'
        ];

        const zones = ['North', 'South', 'West', 'East'];

        for (let i = 0; i < managerNames.length; i++) {
            const name = managerNames[i];
            const email = `${name.toLowerCase().replace(/ /g, '.')}@trackforce.io`;
            
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    name,
                    company: 'TrackForce Enterprise',
                    email,
                    password: 'password123', 
                    role: 'manager',
                    tenant: tenantId,
                    status: 'On Duty',
                    profile: {
                        zone: zones[i % zones.length],
                        designation: 'Operations Manager'
                    }
                });
                await user.save();
                console.log(`Created Manager: ${name}`);
            }
        }

        // 3. Seed some employees to reach ~450 "Used Seats"
        const currentCount = await User.countDocuments({ tenant: tenantId });
        console.log(`Current seat usage: ${currentCount}`);
        
        if (currentCount < 450) {
            console.log(`Seeding ${450 - currentCount} additional employees to reach target usage...`);
            const employeesToSeed = [];
            for (let i = currentCount; i < 450; i++) {
                employeesToSeed.push({
                    name: `Executive ${i + 1}`,
                    company: 'TrackForce Enterprise',
                    email: `exec.${i + 1}@trackforce.io`,
                    password: 'password123',
                    role: 'employee',
                    tenant: tenantId,
                    status: 'Active',
                    profile: {
                        designation: 'Field Executive'
                    }
                });
                if (employeesToSeed.length >= 100) {
                    await User.insertMany(employeesToSeed);
                    employeesToSeed.length = 0;
                }
            }
            if (employeesToSeed.length > 0) {
                await User.insertMany(employeesToSeed);
            }
            console.log('Seeded employees to reach 450 seats.');
        }

        // 4. Seed Audit Logs (linked specifically to this tenant)
        await AuditLog.deleteMany({ tenant: tenantId });
        const auditLogs = [
            { tenant: tenantId, user: 'Admin', email: 'admin@trackforce.io', userRole: 'tenant', type: 'PERMISSIONS UPDATED', action: 'New Node Provisioning: Enabled 5 field reporting units in North-West sector.', role: 'Admin' },
            { tenant: tenantId, user: 'System', email: 'system@trackforce.io', userRole: 'system', type: 'CONFIG UPDATE', action: 'Nexus Protocol Patch: Optimized geofencing synchronization for enhanced tracking accuracy.', role: 'System' },
            { tenant: tenantId, user: 'Security Ops', email: 'security@trackforce.io', userRole: 'tenant', type: 'SECURITY ALERT', action: 'Encryption Key Rotation: Successfully updated SSL/TLS certificates for management nodes.', role: 'SecOps' },
            { tenant: tenantId, user: 'HR Director', email: 'hr@trackforce.io', userRole: 'tenant', type: 'PERMISSIONS UPDATED', action: 'Personnel Cycle: Offboarded 3 obsolete executive nodes as per quarterly audit.', role: 'HR' },
            { tenant: tenantId, user: 'Automation Bot', email: 'bot@trackforce.io', userRole: 'system', type: 'CONFIG UPDATE', action: 'Load Balancing: Distributed task traffic across 4 regional API gateways.', role: 'System' },
            { tenant: tenantId, user: 'Ops Lead', email: 'ops@trackforce.io', userRole: 'tenant', type: 'PLATFORM INITIALIZATION', action: 'Service Extension: Added real-time inventory telemetry for warehouse executives.', role: 'Ops' },
            { tenant: tenantId, user: 'System Monitor', email: 'monitor@trackforce.io', userRole: 'system', type: 'SECURITY ALERT', action: 'Anomaly Detected (South Zone): High frequency sync requests mitigated successfully.', role: 'System' }
        ];
        await AuditLog.insertMany(auditLogs);
        console.log('Seeded tenant-specific audit logs for Recent Operations.');

        console.log('Dashboard seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err.message);
        process.exit(1);
    }
};

seedDashboard();
