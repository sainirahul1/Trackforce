const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables immediately
dotenv.config({ path: path.join(__dirname, '.env') });

const helmet = require('helmet');
const { initLogger } = require('./utils/activityLogger');

// ─── Security Middleware ─────────────────────────────────────────────────────
const { protect } = require('./middleware/authMiddleware');
const validateRole = require('./middleware/validateRole');
const validatePortal = require('./middleware/validatePortal');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const { authLimiter, apiLimiter, publicLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Socket.io Setup - Handled via socket.js module
const initSocket = require('./socket');
const io = initSocket(server);

// ─── Global Middleware ───────────────────────────────────────────────────────

// Security headers (helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow image/upload serving
  contentSecurityPolicy: false, // Disable CSP for flexibility (enable in production with proper config)
}));

// CORS Configuration
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Portal'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  immutable: true,
  lastModified: true,
  etag: true
}));

app.set('io', io);

// Initialize Activity Logger
initLogger(io);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('TrackForce API is running...');
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE REGISTRATION — Portal-Isolated Architecture
// Each portal group applies: protect → validateRole → validatePortal → tenantMW
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Public Routes (No Auth) ─────────────────────────────────────────────────
app.use('/reatchall/public', publicLimiter, require('./routes/core/publicRoutes'));

// ─── Auth Routes (Rate-Limited) ──────────────────────────────────────────────
app.use('/reatchall/auth', authLimiter, require('./routes/core/authRoutes'));

// ─── Employee Portal ─────────────────────────────────────────────────────────
// Middleware stack: auth → role(employee) → portal(employee) → tenant scoping
const employeeRouter = express.Router();
employeeRouter.use(protect);
employeeRouter.use(validateRole('employee'));
employeeRouter.use(validatePortal('employee'));
employeeRouter.use(tenantMiddleware);
employeeRouter.use(apiLimiter);

employeeRouter.use('/visits', require('./routes/employee/visitRoutes'));
employeeRouter.use('/orders', require('./routes/employee/orderRoutes'));
employeeRouter.use('/activity', require('./routes/employee/activityRoutes'));
employeeRouter.use('/tracking', require('./routes/employee/trackingRoutes'));
employeeRouter.use('/stats', require('./routes/employee/statsRoutes'));
employeeRouter.use('/profile', require('./routes/employee/profileRoutes'));
employeeRouter.use('/documents', require('./routes/employee/documentRoutes'));
employeeRouter.use('/tasks', require('./routes/employee/taskRoutes'));
employeeRouter.use('/', require('./routes/employee/employeeRoutes'));

app.use('/reatchall/employee', employeeRouter);

// ─── Manager Portal ─────────────────────────────────────────────────────────
// Middleware stack: auth → role(manager) → portal(manager) → tenant scoping
const managerRouter = express.Router();
managerRouter.use(protect);
managerRouter.use(validateRole('manager'));
managerRouter.use(validatePortal('manager'));
managerRouter.use(tenantMiddleware);
managerRouter.use(apiLimiter);

managerRouter.use('/inventory-orders', require('./routes/manager/inventoryOrderRoutes'));
managerRouter.use('/activity', require('./routes/manager/activityRoutes'));
managerRouter.use('/team', require('./routes/manager/teamRoutes'));

app.use('/reatchall/manager', managerRouter);

// ─── Tenant Portal ──────────────────────────────────────────────────────────
// Middleware stack: auth → role(tenant) → portal(tenant) → tenant scoping
const tenantRouter = express.Router();
tenantRouter.use(protect);
tenantRouter.use(validateRole('tenant'));
tenantRouter.use(validatePortal('tenant'));
tenantRouter.use(tenantMiddleware);
tenantRouter.use(apiLimiter);

tenantRouter.use('/notifications', require('./routes/tenant/notificationRoutes'));
tenantRouter.use('/', require('./routes/tenant/tenantRoutes'));

app.use('/reatchall/tenant', tenantRouter);

// ─── Super Admin Portal ─────────────────────────────────────────────────────
// Middleware stack: auth → role(superadmin) → portal(superadmin) — NO tenant scoping
const superadminRouter = express.Router();
superadminRouter.use(protect);
superadminRouter.use(validateRole('superadmin'));
superadminRouter.use(validatePortal('superadmin'));
superadminRouter.use(apiLimiter);

superadminRouter.use('/companies', require('./routes/superadmin/companyRoutes'));
superadminRouter.use('/subscriptions', require('./routes/superadmin/subscriptionRoutes'));
superadminRouter.use('/analytics', require('./routes/superadmin/analyticsRoutes'));
superadminRouter.use('/notifications', require('./routes/superadmin/notificationRoutes'));
superadminRouter.use('/settings', require('./routes/superadmin/settingsRoutes'));
superadminRouter.use('/manage', require('./routes/superadmin/roleManagementRoutes'));
superadminRouter.use('/update-credentials', require('./routes/superadmin/credentialsRoutes'));

app.use('/reatchall/superadmin', superadminRouter);

// ─── Admin Portal (Full System Access — alias for SuperAdmin) ────────────────
app.use('/reatchall/admin', superadminRouter);

// ─── Shared Routes (Cross-Portal, Auth Required) ────────────────────────────
// Issues are accessible from any portal
app.use('/reatchall/issues', protect, tenantMiddleware, apiLimiter, require('./routes/core/issueRoutes'));

// ─── Legacy Route Compatibility Layer ────────────────────────────────────────
// Redirect old /api/* routes to new /reatchall/* routes during migration
// Remove after all clients are updated
app.use('/api/public', publicLimiter, require('./routes/core/publicRoutes'));
app.use('/api/auth', authLimiter, require('./routes/core/authRoutes'));
app.use('/api/visits', protect, tenantMiddleware, require('./routes/employee/visitRoutes'));
app.use('/api/orders', protect, tenantMiddleware, require('./routes/employee/orderRoutes'));
app.use('/api/activity', protect, tenantMiddleware, require('./routes/employee/activityRoutes'));
app.use('/api/tracking', protect, tenantMiddleware, require('./routes/employee/trackingRoutes'));
app.use('/api/stats', protect, tenantMiddleware, require('./routes/employee/statsRoutes'));
app.use('/api/notifications', protect, tenantMiddleware, require('./routes/tenant/notificationRoutes'));
app.use('/api/employee', protect, tenantMiddleware, require('./routes/employee/employeeRoutes'));
app.use('/api/issues', protect, tenantMiddleware, require('./routes/core/issueRoutes'));
app.use('/api/superadmin/companies', protect, require('./routes/superadmin/companyRoutes'));
app.use('/api/superadmin/subscriptions', protect, require('./routes/superadmin/subscriptionRoutes'));
app.use('/api/superadmin/analytics', protect, require('./routes/superadmin/analyticsRoutes'));
app.use('/api/superadmin/notifications', protect, require('./routes/superadmin/notificationRoutes'));
app.use('/api/superadmin/settings', protect, require('./routes/superadmin/settingsRoutes'));
app.use('/api/superadmin/manage', protect, require('./routes/superadmin/roleManagementRoutes'));
app.use('/api/superadmin/update-credentials', protect, require('./routes/superadmin/credentialsRoutes'));
app.use('/api/tenant', protect, tenantMiddleware, require('./routes/tenant/tenantRoutes'));
app.use('/api/manager/inventory-orders', protect, tenantMiddleware, require('./routes/manager/inventoryOrderRoutes'));
app.use('/api/manager/activity', protect, tenantMiddleware, require('./routes/manager/activityRoutes'));
app.use('/api/employee/tasks', protect, tenantMiddleware, require('./routes/employee/taskRoutes'));

// ─── Centralized Error Handling ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// -----------------------------------------------------------------------------
// Database Connection (Hardened with Resilience & Monitoring)
// -----------------------------------------------------------------------------
let isConnecting = false;
let isStarted = false;

const connectDB = async () => {
  if (isConnecting) return;
  isConnecting = true;

  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    isConnecting = false;
    
    // Start server if not already started
    if (!isStarted) {
      server.listen(PORT, () => {
        console.log(`[SERVER] Protocol: HTTP/Socket.io | Port: ${PORT}`);
        console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'production'}`);
        console.log(`[SERVER] Portal Routes: /reatchall/{employee,manager,tenant,superadmin,admin}/*`);
      });
      isStarted = true;
    }
    return conn;
  } catch (err) {
    console.error(`[DATABASE ERROR] Connection failed: ${err.message}`);
    isConnecting = false;
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Monitor Connection Events
mongoose.connection.on('disconnected', () => {
  console.warn('[DATABASE WARNING] MongoDB disconnected. Attempting to reconnect...');
  connectDB().catch(() => {});
});

mongoose.connection.on('error', (err) => {
  console.error(`[DATABASE ERROR] Mongoose error: ${err.message}`);
});

// Kick off the connection loop
connectDB();
