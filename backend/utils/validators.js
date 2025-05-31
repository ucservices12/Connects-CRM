const { check, validationResult } = require('express-validator');

// Validation middleware
exports.validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

// Organization validation rules
exports.organizationRules = [
  check('name', 'Name is required').not().isEmpty(),
  check('name', 'Name cannot exceed 50 characters').isLength({ max: 50 }),
  check('description', 'Description cannot exceed 500 characters').optional().isLength({ max: 500 }),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('website', 'Please include a valid URL').optional().isURL()
];

// User/Auth validation rules
exports.registerRules = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').not().isEmpty(),
  check('organization', 'Organization ID is required').not().isEmpty()
];

exports.loginRules = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Employee validation rules
exports.employeeRules = [
  check('user', 'User ID is required').not().isEmpty(),
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('employeeId', 'Employee ID is required').not().isEmpty()
];

// Lead validation rules
exports.leadRules = [
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('status', 'Status must be valid').isIn([
    'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'
  ]),
  check('source', 'Source must be valid').isIn([
    'website', 'referral', 'social-media', 'email-campaign', 'event', 'other'
  ])
];

// Task validation rules
exports.taskRules = [
  check('title', 'Title is required').not().isEmpty(),
  check('title', 'Title cannot exceed 100 characters').isLength({ max: 100 }),
  check('description', 'Description cannot exceed 500 characters').optional().isLength({ max: 500 }),
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('assignedTo', 'Assigned user ID is required').not().isEmpty(),
  check('assignedBy', 'Assigning user ID is required').not().isEmpty(),
  check('status', 'Status must be valid').isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  check('priority', 'Priority must be valid').isIn(['low', 'medium', 'high', 'urgent']),
  check('dueDate', 'Due date is required').not().isEmpty().isISO8601().toDate()
];

// Salary validation rules
exports.salaryRules = [
  check('employee', 'Employee ID is required').not().isEmpty(),
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('month', 'Month is required and must be between 1-12').isInt({ min: 1, max: 12 }),
  check('year', 'Year is required').isInt({ min: 2000, max: 2100 }),
  check('basicSalary', 'Basic salary is required').isNumeric()
];

// Leave validation rules
exports.leaveRules = [
  check('employee', 'Employee ID is required').not().isEmpty(),
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('leaveType', 'Leave type is required').isIn([
    'casual', 'sick', 'vacation', 'maternity', 'paternity', 'unpaid', 'other'
  ]),
  check('startDate', 'Start date is required').not().isEmpty().isISO8601().toDate(),
  check('endDate', 'End date is required').not().isEmpty().isISO8601().toDate(),
  check('reason', 'Reason is required').not().isEmpty()
];

// Attendance validation rules
exports.attendanceRules = [
  check('employee', 'Employee ID is required').not().isEmpty(),
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('date', 'Date is required').isISO8601().toDate(),
  check('status', 'Status must be valid').isIn(['present', 'absent', 'half-day', 'late', 'leave'])
];

// Asset validation rules
exports.assetRules = [
  check('name', 'Asset name is required').not().isEmpty(),
  check('type', 'Asset type is required').isIn([
    'laptop', 'desktop', 'phone', 'tablet', 'monitor', 'furniture', 'other'
  ]),
  check('organization', 'Organization ID is required').not().isEmpty(),
  check('condition', 'Condition must be valid').isIn(['new', 'good', 'fair', 'poor'])
];