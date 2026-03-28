const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow if no origin (mobile, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5001',
      'http://127.0.0.1:5173',
    ];

    const isAllowedOrigin = allowedOrigins.includes(origin);
    const isVercel = origin.endsWith('.vercel.app');
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isProdFrontend = process.env.FRONTEND_URL && origin.startsWith(process.env.FRONTEND_URL.replace(/\/$/, ''));

    if (isAllowedOrigin || isVercel || isLocalhost || isProdFrontend) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('TrackForce API is running...');
});

// Routes
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use('/api/employee', require('./routes/employee/employeeRoutes'));

// Super Admin Routes
app.use('/api/superadmin/companies', require('./routes/superadmin/companyRoutes'));
app.use('/api/superadmin/subscriptions', require('./routes/superadmin/subscriptionRoutes'));
app.use('/api/superadmin/analytics', require('./routes/superadmin/analyticsRoutes'));
app.use('/api/superadmin/notifications', require('./routes/superadmin/notificationRoutes'));
app.use('/api/superadmin/settings', require('./routes/superadmin/settingsRoutes'));
app.use('/api/superadmin/manage', require('./routes/superadmin/roleManagementRoutes'));
app.use('/api/tenant', require('./routes/tenantRoutes'));
app.use('/api/manager/inventory-orders', require('./routes/manager/inventoryOrderRoutes'));

// Employee Routes
app.use('/api/employee/tasks', require('./routes/employee/taskRoutes'));

// Database Connection — start server only after DB is ready
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
