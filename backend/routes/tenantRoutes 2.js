const express = require('express');
const { 
  getEmployees, 
  getManagers, 
  createManager, 
  updateManager, 
  deleteManager 
} = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);

router.get('/employees', getEmployees);

router.get('/managers', getManagers);
router.post('/managers', createManager);
router.put('/managers/:id', updateManager);
router.delete('/managers/:id', deleteManager);

module.exports = router;
