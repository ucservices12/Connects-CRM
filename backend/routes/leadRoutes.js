const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Controller to be implemented
// const {
//   getLeads,
//   getLead,
//   createLead,
//   updateLead,
//   deleteLead,
//   addInteraction
// } = require('../controllers/leadController');

// Placeholder route handlers
router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all leads - To be implemented'
  });
});

router.get('/:id', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Get lead ${req.params.id} - To be implemented`
  });
});

router.post('/', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create lead - To be implemented'
  });
});

router.put('/:id', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Update lead ${req.params.id} - To be implemented`
  });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Delete lead ${req.params.id} - To be implemented`
  });
});

router.post('/:id/interactions', protect, (req, res) => {
  res.status(201).json({
    success: true,
    message: `Add interaction to lead ${req.params.id} - To be implemented`
  });
});

module.exports = router;