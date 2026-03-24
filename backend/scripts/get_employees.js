const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ company: 'ReatchAll', role: 'employee' });
    console.log(JSON.stringify(users.map(u => ({ email: u.email, id: u._id })), null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
