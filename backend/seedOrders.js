const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/employee/Order');

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/trackforce";

async function seedOrders() {
  try {
    console.log("Connecting to MongoDB...", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Find an existing order to borrow valid tenant and employee ObjectIds
    const existingOrder = await Order.findOne();
    if (!existingOrder) {
      console.log("No existing orders found to copy tenant/employee refs from. Please create at least 1 order via UI first.");
      process.exit(1);
    }

    const tenantId = existingOrder.tenant;
    const employeeId = existingOrder.employee;

    const today = new Date();

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);

    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(today.getDate() - 20);

    const dummyOrders = [
      {
        storeName: "Daily Filter Test Store",
        items: 5,
        totalAmount: 1250,
        paymentMethod: "UPI",
        status: "completed",
        employee: employeeId,
        tenant: tenantId,
        createdAt: today,
        timestamp: today
      },
      {
        storeName: "Weekly Filter Test Store",
        items: 2,
        totalAmount: 800,
        paymentMethod: "Cash",
        status: "processing",
        employee: employeeId,
        tenant: tenantId,
        createdAt: threeDaysAgo,
        timestamp: threeDaysAgo
      },
      {
        storeName: "Older Config Test Store",
        items: 10,
        totalAmount: 5000,
        paymentMethod: "Credit Card",
        status: "completed",
        employee: employeeId,
        tenant: tenantId,
        createdAt: tenDaysAgo,
        timestamp: tenDaysAgo
      },
      {
        storeName: "Oldest Log Store",
        items: 1,
        totalAmount: 200,
        paymentMethod: "Cash",
        status: "canceled",
        employee: employeeId,
        tenant: tenantId,
        createdAt: twentyDaysAgo,
        timestamp: twentyDaysAgo
      }
    ];

    await Order.insertMany(dummyOrders);
    console.log("Successfully inserted dummy orders using existing tenant", tenantId, "and employee", employeeId);

  } catch (err) {
    console.error("Error seeding orders:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

seedOrders();
