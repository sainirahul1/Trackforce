const express = require('express');
const router = express.Router();
const { 
  getAllSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription 
} = require('../../controllers/superadmin/subscriptionController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getAllSubscriptions);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;
