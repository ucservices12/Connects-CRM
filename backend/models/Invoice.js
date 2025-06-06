const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        validate: {
            validator: v => mongoose.Types.ObjectId.isValid(v),
            message: 'Invalid organizationId',
        }
    },

    client: {
        clientId: {
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
            type: String,
            default: ''
        },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zipCode: { type: String, default: '' },
            country: { type: String, default: '' }
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
        enum: ['Pendding', 'Processing', 'Hold', 'Completed', 'Cancelled', 'Refunded', 'Failed', 'Draft'],
        default: 'Draft'
    },

    dueDate: {
        type: Date
    },

    notes: {
        type: String,
        default: ''
    },

    terms: {
        type: String,
        default: ''
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

    settings: {
        company: {
            name: { type: String, default: '' },
            address: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            phone: { type: String, default: '' },
            email: { type: String, default: '' },
            website: { type: String, default: '' },
            logoUrl: { type: String, default: '' },
            gst: { type: String, default: '' },
            tan: { type: String, default: '' }
        },
        invoice: {
            prefix: { type: String, default: '' },
            nextNumber: { type: String, default: '' },
            terms: { type: String, default: '' },
            notes: { type: String, default: '' },
            defaultTax: { type: Number, default: 0 }
        },
        payment: {
            bankName: { type: String, default: '' },
            accountName: { type: String, default: '' },
            accountNumber: { type: String, default: '' },
            ifscCode: { type: String, default: '' },
            upi: { type: String, default: '' }
        },
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    wasPaidInvoiceEdited: {
        type: Boolean,
        default: false
    }
})

InvoiceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
