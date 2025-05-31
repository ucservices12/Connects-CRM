const Organization = require('../models/Organization');

// @desc    Create new organization
// @route   POST /api/v1/organizations
// @access  Private/Admin
exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all organizations
// @route   GET /api/v1/organizations
// @access  Private/Admin
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single organization
// @route   GET /api/v1/organizations/:id
// @access  Private
exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update organization
// @route   PUT /api/v1/organizations/:id
// @access  Private/Admin
exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private/Admin
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    await organization.remove();

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

// @desc    Update organization subscription plan
// @route   PUT /api/v1/organizations/:id/subscription
// @access  Private/Admin
exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan } = req.body;

    if (!subscriptionPlan) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a subscription plan'
      });
    }

    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      {
        subscriptionPlan,
        subscriptionStartDate: Date.now(),
        subscriptionStatus: 'active'
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};