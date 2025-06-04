const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        validate: {
            validator: v => mongoose.Types.ObjectId.isValid(v),
            message: 'Invalid organizationId'
        }
    },
    client: {
        id: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: [true, 'Please add a company name']
        },
        name: {
            type: String,
            required: [true, 'Please add a client name']
        },
        email: {
            type: String,
            required: [true, 'Please add a client email'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        phone: {
            type: Number,
            default: ''
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    invoiceNo: {
        type: String,
        required: [true, 'Please add an invoice number'],
        unique: true,
        trim: true
    },
    items: [
        {
            description: {
                type: String,
                required: [true, 'Please add a description']
            },
            quantity: {
                type: Number,
                required: [true, 'Please add a quantity'],
                min: [1, 'Quantity must be at least 1']
            },
            rate: {
                type: Number,
                required: [true, 'Please add a rate'],
                min: [0, 'Rate cannot be negative']
            },
            amount: {
                type: Number,
                required: [true, 'Please add an amount']
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: [true, 'Please add a total amount']
    },
    sGST: {
        type: Number,
        default: 0
    },
    cGST: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: [true, 'Please add a grand total']
    },
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Draft'
    },
    dueDate: {
        type: Date
    },
    notes: {
        type: String
    },
    terms: {
        type: String
    },
    sentAt: {
        type: Date
    },
    paidAt: {
        type: Date
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: v => mongoose.Types.ObjectId.isValid(v),
            message: 'Invalid createdBy'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
InvoiceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);