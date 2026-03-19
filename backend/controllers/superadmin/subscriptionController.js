const Subscription = require('../../models/superadmin/Subscription');

// @desc    Get all subscription plans
// @route   GET /api/superadmin/subscriptions
// @access  Private/SuperAdmin
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ price: 1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new subscription plan
// @route   POST /api/superadmin/subscriptions
// @access  Private/SuperAdmin
exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a subscription plan
// @route   PUT /api/superadmin/subscriptions/:id
// @access  Private/SuperAdmin
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a subscription plan
// @route   DELETE /api/superadmin/subscriptions/:id
// @access  Private/SuperAdmin
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
