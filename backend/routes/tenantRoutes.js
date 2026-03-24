const express = require('express');
const { getEmployees } = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);

router.get('/employees', getEmployees);

module.exports = router;
