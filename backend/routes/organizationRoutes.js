const express = require('express');
const { 
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  updateSubscription
} = require('../controllers/organizationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getOrganizations)
  .post(protect, authorize('admin'), createOrganization);

router
  .route('/:id')
  .get(protect, getOrganization)
  .put(protect, authorize('admin'), updateOrganization)
  .delete(protect, authorize('admin'), deleteOrganization);

router
  .route('/:id/subscription')
  .put(protect, authorize('admin'), updateSubscription);

module.exports = router;