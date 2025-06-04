const Invoice = require('../models/Invoice');
const { validationResult } = require('express-validator');
const generatePDF = require('../utils/generatePDF');
const sendEmail = require('../utils/sendEmail');
const EmailTemplate = require('../models/EmailTemplate');

// @desc    Get all invoices
// @route   GET /api/v1/invoices
// @access  Private
exports.getInvoices = async (req, res, next) => {
    try {
        const { orgId, page = 1, limit = 10 } = req.query;

        // Defensive check
        if (!orgId) {
            return res.status(400).json({ success: false, message: "Organization ID required" });
        }

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const filter = { orgId };

        const invoices = await Invoice.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Invoice.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: invoices,
            totalPages: Math.ceil(total / limitNum),
            page: pageNum,
            total
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single invoice
// @route   GET /api/v1/invoices/:id
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
        if (!invoice.orgId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
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
// @route   POST /api/v1/invoices
// @access  Private/Admin
exports.createInvoice = async (req, res, next) => {
    const invoiceData = req.body
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Defensive: check for user and org
        if (!invoiceData.createdBy) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        if (!invoiceData.orgId) {
            return res.status(400).json({
                success: false,
                message: 'Organization ID missing'
            });
        }

        // Calculate totals and validate
        if (invoiceData.items && invoiceData.items.length > 0) {
            let totalAmount = 0;

            // Calculate amount for each item and total
            invoiceData.items.forEach(item => {
                item.amount = item.quantity * item.rate;
                totalAmount += item.amount;
            });

            invoiceData.totalAmount = totalAmount;

            // Calculate grand total with tax
            const taxAmount = totalAmount * (invoiceData.tax / 100 || 0);
            const discountAmount = totalAmount * (invoiceData.discount / 100 || 0);
            invoiceData.grandTotal = totalAmount + taxAmount - discountAmount;
        }

        const invoice = await Invoice.create(invoiceData);

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update invoice
// @route   PUT /api/v1/invoices/:id
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
        if (!invoice.orgId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
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
        if (invoice.items && invoice.items.length > 0) {
            let totalAmount = 0;

            // Calculate amount for each item and total
            invoice.items.forEach(item => {
                item.amount = item.quantity * item.rate;
                totalAmount += item.amount;
            });

            invoice.totalAmount = totalAmount;

            // Calculate grand total with tax
            const taxAmount = totalAmount * (invoice.tax / 100 || 0);
            const discountAmount = totalAmount * (invoice.discount / 100 || 0);
            invoice.grandTotal = totalAmount + taxAmount - discountAmount;
        }

        invoice = await Invoice.findByIdAndUpdate(req.params.id, invoice, {
            new: true,
            runValidators: true
        });

        console.log("invoice ::", invoice);

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
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
        if (!invoice.orgId) {
            return res.status(400).json({
                success: false,
                message: `Organization ID missing`
            });
        }

        // Don't allow deleting paid invoices
        if (invoice.status === 'Paid') {
            return res.status(400).json({
                success: false,
                message: `Cannot delete a paid invoice`
            });
        }

        await Invoice.deleteOne({ _id: invoice._id });

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