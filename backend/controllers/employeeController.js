const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Create new employee
// @route   POST /api/v1/employees
// @access  Private/Admin/HR
exports.createEmployee = async (req, res) => {
  try {
    // Check if employee already exists for the user
    const existingEmployee = await Employee.findOne({ user: req.body.user });
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Employee profile already exists for this user'
      });
    }

    // Check if user exists
    const user = await User.findById(req.body.user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Create employee
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all employees
// @route   GET /api/v1/employees
// @access  Private/Admin/HR
exports.getEmployees = async (req, res) => {
  try {
    // Filter by organization if provided
    let query = {};
    
    if (req.query.organization) {
      query.organization = req.query.organization;
    }

    // Allow filtering by various fields
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete req.query[param]);
    
    // Create query string
    let queryStr = JSON.stringify(req.query);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Employee.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Employee.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate([
      { path: 'user', select: 'name email role' },
      { path: 'organization', select: 'name' }
    ]);

    // Executing query
    const employees = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: employees.length,
      pagination,
      data: employees
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/v1/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate([
        { path: 'user', select: 'name email role' },
        { path: 'organization', select: 'name' }
      ]);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/v1/employees/:id
// @access  Private/Admin/HR
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Make sure user is employee owner or admin
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'hr' && 
      employee.user.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        error: `User ${req.user.id} is not authorized to update this employee`
      });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: `User ${req.user.id} is not authorized to delete this employee`
      });
    }

    await employee.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};