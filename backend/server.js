const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Socket.io Setup - Handled via socket.js module
const initSocket = require('./socket');
const io = initSocket(server);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/api/stats', require('./routes/statsRoutes'));

// Super Admin Routes
app.use('/api/superadmin/companies', require('./routes/superadmin/companyRoutes'));
app.use('/api/superadmin/subscriptions', require('./routes/superadmin/subscriptionRoutes'));
app.use('/api/superadmin/analytics', require('./routes/superadmin/analyticsRoutes'));
app.use('/api/superadmin/notifications', require('./routes/superadmin/notificationRoutes'));
app.use('/api/superadmin/settings', require('./routes/superadmin/settingsRoutes'));
app.use('/api/superadmin/manage', require('./routes/superadmin/roleManagementRoutes'));

// Employee Routes
app.use('/api/employee/tasks', require('./routes/employee/taskRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: err.message || 'Server Error' });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
