const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/employee/Order');
const ManagerOrder = require('./models/manager/ManagerOrder');
const User = require('./models/tenant/User');

dotenv.config();

const seedAllManagers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // 1. Find all managers and an employee (to use as executuive)
    const managers = await User.find({ role: 'manager' });
    const employee = await User.findOne({ role: 'employee' });

    if (managers.length === 0) {
      console.log('No managers found in DB. Run main seeder first.');
      process.exit(1);
    }
    
    if (!employee) {
      console.log('No employee found for order executive field. Seeding might look incomplete.');
    }

    const categories = ['Electronics', 'Office', 'Furniture', 'Accessories', 'Software'];
    const suppliers = ['Global Tech', 'Office Depot', 'Aristo Corp', 'Logitech', 'Microsoft'];
    const statuses = ['active', 'out-of-stock', 'discontinued'];
    const stores = ['Tech Plaza', 'Gadget Hub', 'Digital World', 'Smart Store', 'Retail Max'];
    const orderStatuses = ['pending', 'shipped', 'delivered', 'completed'];

    for (const manager of managers) {
      const tenantId = manager.tenant;
      console.log(`Seeding data for Manager: ${manager.email} (Tenant: ${tenantId})...`);

      // 2. Clear and Seed Manager Orders (10 Records)
      await ManagerOrder.deleteMany({ tenant: tenantId });
      const managerOrders = [];
      for (let i = 1; i <= 10; i++) {
        managerOrders.push({
          tenant: tenantId,
          sku: `SKU-${manager.email.split('@')[0].slice(0, 5)}-${tenantId.toString().slice(-4)}-${100 + i}`,
          name: `Product ${i}`,
          category: categories[i % categories.length],
          stockLevel: Math.floor(Math.random() * 200),
          unit: 'pcs',
          price: Math.floor(Math.random() * 500) + 50,
          supplier: suppliers[i % suppliers.length],
          lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
          status: statuses[Math.floor(Math.random() * statuses.length)],
        });
      }
      await ManagerOrder.insertMany(managerOrders);

      // 3. Clear and Seed Employee Orders (20 Records)
      await Order.deleteMany({ tenant: tenantId });
      const orders = [];
      for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 14));
        orders.push({
          employee: employee ? employee._id : manager._id, // Fallback to manager if no employee
          tenant: tenantId,
          storeName: stores[i % stores.length],
          items: Math.floor(Math.random() * 5) + 1,
          totalAmount: Math.floor(Math.random() * 5000) + 500,
          status: orderStatuses[i % orderStatuses.length],
          paymentMethod: 'Credit Card',
          timestamp: date,
          deliveryDate: new Date(date.getTime() + 86400000).toISOString().split('T')[0]
        });
      }
      await Order.insertMany(orders);
      console.log(`- Seeded 10 products and 20 orders for ${manager.email}`);
    }

    console.log('Universal Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedAllManagers();
