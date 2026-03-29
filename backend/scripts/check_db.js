const mongoose = require('mongoose');
const User = require('./models/tenant/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const users = await User.find({ 'profile.profileImage': { $exists: true, $ne: null } });
        console.log(`Found ${users.length} users with a profileImage set.`);
        if(users.length > 0) {
            console.log("First user email:", users[0].email);
            console.log("Image data prefix:", users[0].profile.profileImage.substring(0, 50) + '...');
        }
        
        const allUsers = await User.find();
        console.log(`Total users in DB: ${allUsers.length}`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}).catch(console.error);
