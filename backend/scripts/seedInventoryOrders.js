const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Order = require('../models/employee/Order');
const Inventory = require('../models/manager/Inventory');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find a tenant-level user or a manager to get tenant ID
    const manager = await User.findOne({ role: 'manager' });
    const employee = await User.findOne({ role: 'employee' });

    if (!manager || !employee) {
      console.error('Could not find a manager or employee in the database to associate data with.');
      process.exit(1);
    }

    const tenantId = manager.tenant || employee.tenant;

    // Clear existing manager inventory and some orders for this tenant
    // (Optional: only clear what we're about to seed)
    await Inventory.deleteMany({ tenant: tenantId });
    // await Order.deleteMany({ tenant: tenantId }); // Be careful here

    // 1. Seed Inventory
    const inventoryItems = [
      {
        tenant: tenantId,
        sku: 'SKU-FMCG-001',
        name: 'Organic Fruit Juice 1L',
        category: 'Beverages',
        stockLevel: 450,
        minStockLevel: 50,
        price: 120,
      },
      {
        tenant: tenantId,
        sku: 'SKU-FMCG-002',
        name: 'Whole Grain Bread 500g',
        category: 'Bakery',
        stockLevel: 120,
        minStockLevel: 20,
        price: 45,
      },
      {
        tenant: tenantId,
        sku: 'SKU-FMCG-003',
        name: 'Greek Yogurt 200g',
        category: 'Dairy',
        stockLevel: 15,
        minStockLevel: 30,
        price: 60,
      },
    ];

    await Inventory.insertMany(inventoryItems);
    console.log('Inventory seeded successfully.');

    // 2. Seed Orders for the last 7 days
    const stores = ['Global Tech HQ', 'North Star Retail', 'Prime Logistics', 'City Square Mall', 'Evergreen Mart'];
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'completed'];
    const orders = [];

    for (let i = 0; i < 200; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Within last 7 days
      
      orders.push({
        employee: employee._id,
        tenant: tenantId,
        storeName: stores[Math.floor(Math.random() * stores.length)],
        items: Math.floor(Math.random() * 20) + 1,
        totalAmount: (Math.floor(Math.random() * 200) + 50) * 100, // ₹5,000 to ₹25,000
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: 'Credit Card',
        deliveryDate: date.toISOString().split('T')[0],
        timestamp: date,
      });
    }

    await Order.insertMany(orders);
    console.log(`Seeded ${orders.length} orders successfully.`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
