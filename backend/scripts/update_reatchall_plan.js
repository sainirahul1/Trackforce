const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updatePlan = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const userId = '69c0fbbe60763acca36b8dbf';
    const user = await User.findById(userId);

    if (!user) {
      console.log('User ReatchAll not found.');
      process.exit(1);
    }

    user.subscription = {
      plan: 'Demo',
      status: 'trial',
      price: 0,
      startDate: new Date(),
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      employeeLimit: 10,
      features: ['Up to 10 Employees', 'Advanced Analytics', 'Full GPS Suite', '7-Day Trial'],
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'VISA'
      },
      billingHistory: []
    };

    await user.save();
    console.log('Successfully updated ReatchAll session with Demo plan.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating plan:', err);
    process.exit(1);
  }
};

updatePlan();
