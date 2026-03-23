require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/employee/Order');
const User = require('./models/tenant/User');
const Tenant = require('./models/superadmin/Tenant');

const injectOrders = async () => {
  try {
    console.log('Connecting to DB...', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Find any user and tenant to associate
    const user = await User.findOne();
    const tenant = await Tenant.findOne();

    if (!user || !tenant) {
      console.log('No user or tenant found to associate orders with.');
      process.exit();
    }

    const today = new Date();
    
    const ordersData = [
      {
        employee: user._id,
        tenant: tenant._id,
        storeName: 'Reliance Smart (Dummy Today)',
        items: [{ name: 'Assorted Items', quantity: 15, price: 100 }],
        totalAmount: 1500,
        status: 'pending',
        timestamp: today, 
      },
      {
        employee: user._id,
        tenant: tenant._id,
        storeName: 'Global Mart (Dummy 3 days ago)',
        items: [{ name: 'Assorted Items', quantity: 5, price: 200 }],
        totalAmount: 1000,
        status: 'completed',
        timestamp: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), 
      },
      {
        employee: user._id,
        tenant: tenant._id,
        storeName: 'Daily Needs (Dummy 6 days ago)',
        items: [{ name: 'Assorted Items', quantity: 20, price: 50 }],
        totalAmount: 1000,
        status: 'shipped',
        timestamp: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), 
      },
      {
        employee: user._id,
        tenant: tenant._id,
        storeName: 'Mega Store (Dummy 10 days ago)',
        items: [{ name: 'Assorted Items', quantity: 50, price: 100 }],
        totalAmount: 5000,
        status: 'delivered',
        timestamp: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), 
      }
    ];

    await Order.insertMany(ordersData);
    console.log('Successfully inserted 4 dummy orders with different dates.');
    process.exit();
  } catch (error) {
    console.error('Error inserting dummy orders:', error);
    process.exit(1);
  }
};

injectOrders();
