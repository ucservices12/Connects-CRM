const Invoice = require('../models/Invoice');
const { validationResult } = require('express-validator');
const generatePDF = require('../utils/generatePDF');
const sendEmail = require('../utils/sendEmail');
const EmailTemplate = require('../models/EmailTemplate');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res, next) => {
    try {
        // Build query
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Remove fields from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource with organization scope
        query = Invoice.find({
            ...JSON.parse(queryStr),
            organizationId: req.organizationId
        });

        // Select fields
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
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Invoice.countDocuments({
            ...JSON.parse(queryStr),
            organizationId: req.organizationId
        });

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const invoices = await query;

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
            count: invoices.length,
            pagination,
            data: invoices
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: `Invoice not found with id of ${req.params.id}`
            });
        }

        // Defensive check for organizationId
        if (!invoice.organizationId || !req.organizationId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
            });
        }

        if (invoice.organizationId.toString() !== req.organizationId.toString()) {
            return res.status(403).json({
                success: false,
                message: `Not authorized to access this invoice`
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private/Admin
exports.createInvoice = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Defensive: check for user and org
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        if (!invoice.organizationId || !req.organizationId) {
            return res.status(400).json({
                success: false,
                message: 'Organization ID missing'
            });
        }
        if (invoice.organizationId.toString() !== req.organizationId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this invoice'
            });
        }

        // Add user id to request body
        req.body.createdBy = req.user.id;
        req.body.organizationId = req.organizationId;

        // Calculate totals and validate
        if (req.body.items && req.body.items.length > 0) {
            let totalAmount = 0;

            // Calculate amount for each item and total
            req.body.items.forEach(item => {
                item.amount = item.quantity * item.rate;
                totalAmount += item.amount;
            });

            req.body.totalAmount = totalAmount;

            // Calculate grand total with tax
            const taxAmount = totalAmount * (req.body.tax / 100 || 0);
            const discountAmount = totalAmount * (req.body.discount / 100 || 0);
            req.body.grandTotal = totalAmount + taxAmount - discountAmount;
        }

        const invoice = await Invoice.create(req.body);

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private/Admin
exports.updateInvoice = async (req, res, next) => {
    try {
        let invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: `Invoice not found with id of ${req.params.id}`
            });
        }

        // Defensive check for organizationId
        if (!invoice.organizationId || !req.organizationId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
            });
        }

        if (invoice.organizationId.toString() !== req.organizationId.toString()) {
            return res.status(403).json({
                success: false,
                message: `Not authorized to update this invoice`
            });
        }

        // Don't allow updating paid invoices
        if (invoice.status === 'Paid') {
            return res.status(400).json({
                success: false,
                message: `Cannot update a paid invoice`
            });
        }

        // Recalculate totals if items are updated
        if (req.body.items && req.body.items.length > 0) {
            let totalAmount = 0;

            // Calculate amount for each item and total
            req.body.items.forEach(item => {
                item.amount = item.quantity * item.rate;
                totalAmount += item.amount;
            });

            req.body.totalAmount = totalAmount;

            // Calculate grand total with tax
            const taxAmount = totalAmount * (req.body.tax / 100 || 0);
            const discountAmount = totalAmount * (req.body.discount / 100 || 0);
            req.body.grandTotal = totalAmount + taxAmount - discountAmount;
        }

        invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
exports.deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: `Invoice not found with id of ${req.params.id}`
            });
        }

        // Defensive check for organizationId
        if (!invoice.organizationId || !req.organizationId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
            });
        }

        if (invoice.organizationId.toString() !== req.organizationId.toString()) {
            return res.status(403).json({
                success: false,
                message: `Not authorized to delete this invoice`
            });
        }

        // Don't allow deleting paid invoices
        if (invoice.status === 'Paid') {
            return res.status(400).json({
                success: false,
                message: `Cannot delete a paid invoice`
            });
        }

        await invoice.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Generate invoice PDF
// @route   GET /api/invoices/:id/pdf
// @access  Private
exports.generateInvoicePDF = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: `Invoice not found with id of ${req.params.id}`
            });
        }

        // Defensive check for organizationId
        if (!invoice.organizationId || !req.organizationId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
            });
        }

        if (invoice.organizationId.toString() !== req.organizationId.toString()) {
            return res.status(403).json({
                success: false,
                message: `Not authorized to access this invoice`
            });
        }

        // Generate PDF
        const pdf = await generatePDF(invoice);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNo}.pdf`);

        // Send PDF
        res.send(pdf);
    } catch (err) {
        next(err);
    }
};

// @desc    Send invoice email
// @route   POST /api/invoices/:id/send
// @access  Private/Admin
exports.sendInvoiceEmail = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: `Invoice not found with id of ${req.params.id}`
            });
        }

        // Defensive check for organizationId
        if (!invoice.organizationId || !req.organizationId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
            });
        }

        if (invoice.organizationId.toString() !== req.organizationId.toString()) {
            return res.status(403).json({
                success: false,
                message: `Not authorized to send this invoice`
            });
        }

        // Find email template
        let template;
        if (req.body.templateId) {
            template = await EmailTemplate.findById(req.body.templateId);
        } else {
            // Get default template
            template = await EmailTemplate.findOne({
                organizationId: req.organizationId,
                isDefault: true
            });
        }

        if (!template) {
            return res.status(404).json({
                success: false,
                message: `Email template not found`
            });
        }

        // Generate PDF
        const pdf = await generatePDF(invoice);

        // Replace placeholders in template
        let subject = template.subject;
        let body = template.body;

        // Replace common placeholders
        const placeholders = {
            '{{clientName}}': invoice.client.name,
            '{{invoiceNo}}': invoice.invoiceNo,
            '{{totalAmount}}': invoice.totalAmount.toFixed(2),
            '{{grandTotal}}': invoice.grandTotal.toFixed(2),
            '{{dueDate}}': invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'
        };

        // Replace placeholders in subject and body
        for (const [key, value] of Object.entries(placeholders)) {
            subject = subject.replace(new RegExp(key, 'g'), value);
            body = body.replace(new RegExp(key, 'g'), value);
        }

        // Send email
        await sendEmail({
            to: invoice.client.email,
            subject,
            html: body,
            attachments: [
                {
                    filename: `invoice-${invoice.invoiceNo}.pdf`,
                    content: pdf
                }
            ]
        });

        // Update invoice status and sentAt
        await Invoice.findByIdAndUpdate(req.params.id, {
            status: 'Sent',
            sentAt: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Invoice sent successfully'
        });
    } catch (err) {
        next(err);
    }
};