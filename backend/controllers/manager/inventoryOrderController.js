const inventoryOrderService = require('../../services/inventoryOrderService');

/**
 * @desc    Get inventory and order dashboard statistics
 * @route   GET /api/manager/inventory-orders/stats
 * @access  Private (Manager)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const result = await inventoryOrderService.getDashboardStats(req.tenantId, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    console.error('getDashboardStats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get daily revenue data for the last 7 days (Chart)
 * @route   GET /api/manager/inventory-orders/revenue-chart
 * @access  Private (Manager)
 */
exports.getRevenueChartData = async (req, res) => {
  try {
    const result = await inventoryOrderService.getRevenueChartData(req.tenantId, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get recent orders with executive details
 * @route   GET /api/manager/inventory-orders/recent
 * @access  Private (Manager)
 */
exports.getRecentOrders = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query;
    const result = await inventoryOrderService.getRecentOrders(req.tenantId, req.user._id, search, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Export Ledger as CSV
 * @route   GET /api/manager/inventory-orders/export
 */
exports.exportLedger = async (req, res) => {
  try {
    const csv = await inventoryOrderService.getExportLedgerData(req.tenantId, req.user._id);
    if (!csv) {
      return res.status(404).json({ success: false, message: 'No orders found for export' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ledger_export.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get full inventory list
 * @route   GET /api/manager/inventory-orders/inventory
 * @access  Private (Manager)
 */
exports.getInventory = async (req, res) => {
  try {
    const result = await inventoryOrderService.getInventory(req.tenantId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new inventory item
 * @route   POST /api/manager/inventory-orders/inventory
 */
exports.createInventory = async (req, res) => {
  try {
    const result = await inventoryOrderService.createInventory(req.tenantId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update inventory item
 * @route   PUT /api/manager/inventory-orders/inventory/:id
 */
exports.updateInventory = async (req, res) => {
  try {
    const result = await inventoryOrderService.updateInventory(req.tenantId, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Item not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete inventory item
 * @route   DELETE /api/manager/inventory-orders/inventory/:id
 */
exports.deleteInventory = async (req, res) => {
  try {
    const result = await inventoryOrderService.deleteInventory(req.tenantId, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Item not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new order
 * @route   POST /api/manager/inventory-orders/order
 */
exports.createOrder = async (req, res) => {
  try {
    const result = await inventoryOrderService.createOrder(req.tenantId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update order
 * @route   PUT /api/manager/inventory-orders/order/:id
 */
exports.updateOrder = async (req, res) => {
  try {
    const result = await inventoryOrderService.updateOrder(req.tenantId, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/manager/inventory-orders/order/:id
 */
exports.deleteOrder = async (req, res) => {
  try {
    const result = await inventoryOrderService.deleteOrder(req.tenantId, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
