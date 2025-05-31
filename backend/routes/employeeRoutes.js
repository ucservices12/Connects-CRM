const express = require('express');
const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin', 'hr', 'manager'), getEmployees)
  .post(protect, authorize('admin', 'hr'), createEmployee);

router
  .route('/:id')
  .get(protect, getEmployee)
  .put(protect, authorize('admin', 'hr'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;