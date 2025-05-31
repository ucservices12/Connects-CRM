const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add asset name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['laptop', 'desktop', 'phone', 'tablet', 'monitor', 'furniture', 'other'],
    required: [true, 'Please specify asset type']
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  vendor: {
    name: String,
    contact: String
  },
  warranty: {
    expiryDate: Date,
    details: String
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'under-maintenance', 'disposed'],
    default: 'available'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee'
  },
  assignedDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor'],
    default: 'new'
  },
  notes: {
    type: String
  },
  assetHistory: [
    {
      action: {
        type: String,
        enum: ['purchased', 'assigned', 'returned', 'maintenance', 'disposed'],
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      performedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      notes: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Asset', AssetSchema);