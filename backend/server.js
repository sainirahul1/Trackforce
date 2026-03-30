const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initLogger } = require('./utils/activityLogger');

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

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('[SOCKET] User connected:', socket.id);

  socket.on('join_tenant', (tenantId) => {
    socket.join(`tenant:${tenantId}`);
    console.log(`[SOCKET] User ${socket.id} joined tenant room: ${tenantId}`);
  });

  socket.on('join_user', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`[SOCKET] User ${socket.id} joined user room: ${userId}`);
  });

  socket.on('join_role', (role) => {
    socket.join(`role:${role}`);
    console.log(`[SOCKET] User ${socket.id} joined role room: ${role}`);
  });

  socket.on('join_tenant_role', ({ tenantId, role }) => {
    socket.join(`tenant:${tenantId}:role:${role}`);
    console.log(`[SOCKET] User ${socket.id} joined tenant-role room: ${tenantId}:${role}`);
  });

  socket.on('disconnect', () => {
    console.log('[SOCKET] User disconnected:', socket.id);
  });
});

// Initialize Activity Logger
initLogger(io);

// Basic Route
app.get('/', (req, res) => {
  res.send('TrackForce API is running...');
});

// Routes
app.use('/api/public', require('./routes/core/publicRoutes'));
app.use('/api/auth', require('./routes/core/authRoutes'));
app.use('/api/visits', require('./routes/employee/visitRoutes'));
app.use('/api/orders', require('./routes/employee/orderRoutes'));
app.use('/api/activity', require('./routes/employee/activityRoutes'));
app.use('/api/tracking', require('./routes/employee/trackingRoutes'));
app.use('/api/stats', require('./routes/employee/statsRoutes'));
app.use('/api/notifications', require('./routes/tenant/notificationRoutes'));

app.use('/api/employee', require('./routes/employee/employeeRoutes'));
app.use('/api/issues', require('./routes/core/issueRoutes'));

// Super Admin Routes
app.use('/api/superadmin/companies', require('./routes/superadmin/companyRoutes'));
app.use('/api/superadmin/subscriptions', require('./routes/superadmin/subscriptionRoutes'));
app.use('/api/superadmin/analytics', require('./routes/superadmin/analyticsRoutes'));
app.use('/api/superadmin/notifications', require('./routes/superadmin/notificationRoutes'));
app.use('/api/superadmin/settings', require('./routes/superadmin/settingsRoutes'));
app.use('/api/superadmin/manage', require('./routes/superadmin/roleManagementRoutes'));
app.use('/api/superadmin/update-credentials', require('./routes/superadmin/credentialsRoutes'));
app.use('/api/tenant', require('./routes/tenant/tenantRoutes'));
app.use('/api/manager/inventory-orders', require('./routes/manager/inventoryOrderRoutes'));

// Employee Routes
app.use('/api/employee/tasks', require('./routes/employee/taskRoutes'));

// Database Connection — start server only after DB is ready
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
