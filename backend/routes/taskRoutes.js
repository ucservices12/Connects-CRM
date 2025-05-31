const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Controller to be implemented
// const {
//   getTasks,
//   getTask,
//   createTask,
//   updateTask,
//   deleteTask,
//   addComment
// } = require('../controllers/taskController');

// Placeholder route handlers
router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all tasks - To be implemented'
  });
});

router.get('/:id', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Get task ${req.params.id} - To be implemented`
  });
});

router.post('/', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create task - To be implemented'
  });
});

router.put('/:id', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Update task ${req.params.id} - To be implemented`
  });
});

router.delete('/:id', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Delete task ${req.params.id} - To be implemented`
  });
});

router.post('/:id/comments', protect, (req, res) => {
  res.status(201).json({
    success: true,
    message: `Add comment to task ${req.params.id} - To be implemented`
  });
});

module.exports = router;