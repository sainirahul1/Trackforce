const express = require('express');
const { getOrders, createOrder, updateOrder, getOrderStats } = require('../../controllers/employee/orderController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');
const router = express.Router();

// Apply middleware
router.use(protect);
router.use(tenantMiddleware);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.get('/stats', getOrderStats);

router.route('/:id')
  .put(updateOrder);

module.exports = router;
