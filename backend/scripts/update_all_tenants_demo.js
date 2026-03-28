const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateAllTenants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const result = await User.updateMany(
      { role: 'tenant' },
      {
        $set: {
          subscription: {
            plan: 'Demo',
            status: 'trial',
            price: 0,
            startDate: new Date(),
            trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            employeeLimit: 10,
            features: ['Up to 10 Employees', 'Advanced Analytics', 'Full GPS Suite', '7-Day Trial'],
            paymentMethod: {
              type: 'card',
              last4: '4242',
              brand: 'VISA'
            },
            billingHistory: []
          }
        }
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} tenant(s) with the Demo plan.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating tenants:', err);
    process.exit(1);
  }
};

updateAllTenants();
