const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getRevenueChartData, 
  getRecentOrders,
  getInventory,
  exportLedger,
  createInventory,
  updateInventory,
  deleteInventory,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../../controllers/manager/inventoryOrderController');
const { protect } = require('../../middleware/authMiddleware');
const { manager } = require('../../middleware/managerMiddleware');

// Apply protection and manager middleare to all routes
router.use(protect);
router.use(manager);

router.get('/stats', getDashboardStats);
router.get('/revenue-chart', getRevenueChartData);
router.get('/export', exportLedger);

router.route('/recent')
  .get(getRecentOrders);

router.route('/inventory')
  .get(getInventory)
  .post(createInventory);

router.route('/inventory/:id')
  .put(updateInventory)
  .delete(deleteInventory);

router.route('/order')
  .post(createOrder);

router.route('/order/:id')
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;
