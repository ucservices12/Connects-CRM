// routes/invoiceSettingRoutes.js
const express = require('express');
const {
    createSettings,
    getSettings,
} = require('../controllers/invoiceController');

const { protect, authorize, ensureOrganizationAccess } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(ensureOrganizationAccess);

router.route('/')
    .post(authorize('admin'), createSettings)
    .get(authorize('admin', 'manager'), getSettings)

module.exports = router;
