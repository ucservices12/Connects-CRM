const express = require('express');
const { check } = require('express-validator');
const { 
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  sendInvoiceEmail
} = require('../controllers/invoiceController');
const { protect, authorize, ensureOrganizationAccess } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(ensureOrganizationAccess);

router.route('/')
  .get(getInvoices)
  .post(
    authorize('admin', 'manager'),
    [
      check('client.name', 'Client name is required').not().isEmpty(),
      check('client.email', 'Client email is required').isEmail(),
      check('invoiceNo', 'Invoice number is required').not().isEmpty(),
      check('items', 'At least one item is required').isArray({ min: 1 }),
      check('items.*.description', 'Item description is required').not().isEmpty(),
      check('items.*.quantity', 'Item quantity is required').isNumeric(),
      check('items.*.rate', 'Item rate is required').isNumeric()
    ],
    createInvoice
  );

router.route('/:id')
  .get(getInvoice)
  .put(authorize('admin', 'manager'), updateInvoice)
  .delete(authorize('admin'), deleteInvoice);

router.get('/:id/pdf', generateInvoicePDF);
router.post('/:id/send', authorize('admin', 'manager'), sendInvoiceEmail);

module.exports = router;