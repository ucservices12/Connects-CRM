const EmailTemplate = require('../models/EmailTemplate');
const { validationResult } = require('express-validator');

// @desc    Get all email templates
// @route   GET /api/email-templates
// @access  Private
exports.getEmailTemplates = async (req, res, next) => {
  try {
    const templates = await EmailTemplate.find({
      organizationId: req.organizationId
    });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single email template
// @route   GET /api/email-templates/:id
// @access  Private
exports.getEmailTemplate = async (req, res, next) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Email template not found with id of ${req.params.id}`
      });
    }

    // Make sure user belongs to template's organization
    if (template.organizationId.toString() !== req.organizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: `Not authorized to access this email template`
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new email template
// @route   POST /api/email-templates
// @access  Private/Admin
exports.createEmailTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user id to request body
    req.body.createdBy = req.user.id;
    req.body.organizationId = req.organizationId;

    // If setting as default, unset any existing defaults
    if (req.body.isDefault) {
      await EmailTemplate.updateMany(
        { organizationId: req.organizationId, isDefault: true },
        { isDefault: false }
      );
    }

    const template = await EmailTemplate.create(req.body);

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update email template
// @route   PUT /api/email-templates/:id
// @access  Private/Admin
exports.updateEmailTemplate = async (req, res, next) => {
  try {
    let template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Email template not found with id of ${req.params.id}`
      });
    }

    // Make sure user belongs to template's organization
    if (template.organizationId.toString() !== req.organizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: `Not authorized to update this email template`
      });
    }

    // If setting as default, unset any existing defaults
    if (req.body.isDefault) {
      await EmailTemplate.updateMany(
        {
          organizationId: req.organizationId,
          isDefault: true,
          _id: { $ne: req.params.id }
        },
        { isDefault: false }
      );
    }

    template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete email template
// @route   DELETE /api/email-templates/:id
// @access  Private/Admin
exports.deleteEmailTemplate = async (req, res, next) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Email template not found with id of ${req.params.id}`
      });
    }

    // Make sure user belongs to template's organization
    if (template.organizationId.toString() !== req.organizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: `Not authorized to delete this email template`
      });
    }

    // Don't allow deleting default template
    if (template.isDefault) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete the default email template`
      });
    }

    await template.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};