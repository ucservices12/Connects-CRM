const Organization = require('../models/Organization');

// Check if organization has access to specific module
exports.checkModuleAccess = (module) => async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.user.organization);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    if (organization.subscriptionStatus !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Organization subscription is not active'
      });
    }

    if (!organization.planFeatures.modules[module]) {
      return res.status(403).json({
        success: false,
        error: `Your current plan does not include access to ${module} module`
      });
    }

    // Add organization plan details to request for use in controllers
    req.organizationPlan = {
      name: organization.subscriptionPlan,
      features: organization.planFeatures
    };

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error checking module access'
    });
  }
};

// Check if organization has reached employee limit
exports.checkEmployeeLimit = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.user.organization);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const currentEmployeeCount = await organization.employees.length;

    if (currentEmployeeCount >= organization.planFeatures.maxEmployees) {
      return res.status(403).json({
        success: false,
        error: `Employee limit (${organization.planFeatures.maxEmployees}) reached for your current plan`
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error checking employee limit'
    });
  }
};