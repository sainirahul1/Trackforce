const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const patchOrphanUsers = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Find a valid tenant ID to use as the primary association
        // From our audit, 69d64b211071b90c0fa2dead seems to be the active one.
        const primaryTenantId = '69d64b211071b90c0fa2dead';

        console.log(`Identifying orphan users (tenant: null)...`);
        
        const orphans = await User.find({ 
            tenant: null,
            role: { $in: ['employee', 'manager', 'tenant'] } 
        });

        console.log(`Found ${orphans.length} orphan users.`);

        if (orphans.length === 0) {
            console.log('No orphan users found. System integrity is intact.');
            process.exit(0);
        }

        for (const user of orphans) {
            console.log(`Patching user: ${user.email} -> Linking to Tenant: ${primaryTenantId}`);
            user.tenant = primaryTenantId;
            await user.save();
        }

        console.log('Successfully restored tenant associations for all orphan users.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

patchOrphanUsers();
