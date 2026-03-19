const mongoose = require('mongoose');

const platformMetricSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['global_metric', 'system_health', 'growth_stat'],
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true, collection: 'superadmin.metrics' });

module.exports = mongoose.model('PlatformMetric', platformMetricSchema);
