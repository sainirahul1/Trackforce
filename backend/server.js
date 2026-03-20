const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('TrackForce API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));
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
