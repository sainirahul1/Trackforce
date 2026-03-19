const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
