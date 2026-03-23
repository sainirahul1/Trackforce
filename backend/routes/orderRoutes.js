const express = require('express');
const { getOrders, createOrder, updateOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const router = express.Router();

// Apply middleware
router.use(protect);
router.use(tenantMiddleware);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .put(updateOrder);

module.exports = router;
