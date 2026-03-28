const express = require('express');
const { 
  getEmployees, 
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getManagers, 
  createManager, 
  updateManager, 
  deleteManager,
  getTenantSettings,
  updateGeneralInfo,
  updatePassword,
  updateLocalization,
  updateAccountPreferences,
  requestDataExport,
  signOutAllManagers,
  getSubscription,
  updateSubscription,
  getAvailablePlans,
} = require('../controllers/tenantController');
const { 
  getDashboardStats, 
  getDashboardManagers 
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);

router.get('/employees', getEmployees);
router.get('/employees/:id', getEmployeeById);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

router.get('/managers', getManagers);
router.post('/managers', createManager);
router.put('/managers/:id', updateManager);
router.delete('/managers/:id', deleteManager);

// Settings routes
router.get('/settings', getTenantSettings);
router.put('/settings/general', updateGeneralInfo);
router.put('/settings/password', updatePassword);
router.put('/settings/localization', updateLocalization);
router.put('/settings/account', updateAccountPreferences);
router.post('/settings/signout-managers', signOutAllManagers);
router.get('/settings/export', requestDataExport);
// Subscription routes (Tenant-only)
router.get('/subscription', getSubscription);
router.put('/subscription', updateSubscription);
router.get('/available-plans', getAvailablePlans);

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/dashboard-managers', getDashboardManagers);

module.exports = router;
