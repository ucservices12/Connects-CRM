const mongoose = require('mongoose');

const InvoiceSettingSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        unique: true
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
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('InvoiceSetting', InvoiceSettingSchema);
