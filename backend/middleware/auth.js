const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Ensure user can only access resources in their organization
exports.ensureOrganizationAccess = async (req, res, next) => {
  // Get organization ID from request parameters or body
  const resourceOrgId = req.params.organizationId ||
    req.body.organizationId ||
    req.query.organizationId;

  // If organizationId in the request doesn't match the user's organization
  if (resourceOrgId && resourceOrgId !== req.organizationId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access resources from other organizations'
    });
  }

  // Set organization ID in request for controllers to use
  req.organizationId = req.organizationId;

  next();
};