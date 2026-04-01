const express = require('express');
const router = express.Router();
const {
  getRoleCounts,
  getPermissions,
  updatePermissions,
  getAuditLogs,
  createAuditLog,
  getUsersByRole,
  impersonateUser
} = require('../../controllers/superadmin/roleManagementController');

// All routes are implicitly under /api/superadmin/manage
router.get('/counts', getRoleCounts);
router.get('/users/:role', getUsersByRole);
router.post('/users/:id/impersonate', impersonateUser);
router.get('/permissions', getPermissions);
router.put('/permissions', updatePermissions);
router.get('/audit-logs', getAuditLogs);
router.post('/audit-logs', createAuditLog);

module.exports = router;
