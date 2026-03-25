const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');
const { employee } = require('../../middleware/employeeMiddleware');

// Apply middleware to all employee routes
router.use(protect);
router.use(tenantMiddleware);
router.use(employee); // Ensure the user has employee/manager/tenant role

// General employee routes (can add more later)
// For example: router.get('/dashboard', getEmployeeDashboard);

// Mount specific feature routes under the /api/employee prefix
router.use('/profile', require('./profileRoutes'));
router.use('/documents', require('./documentRoutes'));

module.exports = router;
