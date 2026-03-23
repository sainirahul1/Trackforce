const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/tenant/User');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findById('69bd05f66a0c7053c7baa200');
    if (user) {
      console.log('USER_EXISTS=true');
      console.log('TENANT_ID=' + user.tenant);
    } else {
      console.log('USER_EXISTS=false');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUser();
