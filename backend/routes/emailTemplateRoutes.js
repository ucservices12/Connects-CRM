const express = require('express');
const { check } = require('express-validator');
const { 
  getEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate
} = require('../controllers/emailTemplateController');
const { protect, authorize, ensureOrganizationAccess } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(ensureOrganizationAccess);

router.route('/')
  .get(getEmailTemplates)
  .post(
    authorize('admin', 'manager'),
    [
      check('name', 'Template name is required').not().isEmpty(),
      check('subject', 'Email subject is required').not().isEmpty(),
      check('body', 'Email body is required').not().isEmpty()
    ],
    createEmailTemplate
  );

router.route('/:id')
  .get(getEmailTemplate)
  .put(authorize('admin', 'manager'), updateEmailTemplate)
  .delete(authorize('admin'), deleteEmailTemplate);

module.exports = router;