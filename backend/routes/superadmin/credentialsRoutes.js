const express = require('express');
const router = express.Router();
const { updateCredentials } = require('../../controllers/superadmin/credentialsController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.put('/', protect, admin, updateCredentials);

module.exports = router;
