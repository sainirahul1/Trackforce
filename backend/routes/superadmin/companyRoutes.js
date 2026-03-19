const express = require('express');
const router = express.Router();
const { 
  getAllTenants, 
  provisionTenant, 
  updateTenantStatus,
  updateTenant,
  toggleTenantSuspension,
  deleteTenant
} = require('../../controllers/superadmin/companyController');
const { protect, admin } = require('../../middleware/authMiddleware');

// All routes are protected and restricted to SuperAdmins
router.use(protect);
router.use(admin);

router.get('/', getAllTenants);
router.post('/', provisionTenant);
router.patch('/:id/status', updateTenantStatus);
router.put('/:id', updateTenant);
router.patch('/:id/suspend', toggleTenantSuspension);
router.delete('/:id', deleteTenant);

module.exports = router;
