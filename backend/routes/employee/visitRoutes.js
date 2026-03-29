const express = require('express');
const { getVisits, getVisitById, createVisit, updateVisit } = require('../../controllers/employee/visitController');
const { protect } = require('../../middleware/authMiddleware');
const tenantMiddleware = require('../../middleware/tenantMiddleware');
const router = express.Router();

// Apply protect and tenantMiddleware to all visit routes
router.use(protect);
router.use(tenantMiddleware);

router.route('/')
  .get(getVisits)
  .post(createVisit);

router.route('/:id')
  .get(getVisitById)
  .patch(updateVisit);

module.exports = router;
