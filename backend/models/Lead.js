const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  company: {
    type: String
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'email-campaign', 'event', 'other'],
    default: 'other'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  value: {
    type: Number
  },
  notes: {
    type: String
  },
  interactions: [
    {
      type: {
        type: String,
        enum: ['call', 'email', 'meeting', 'other'],
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      notes: String,
      outcome: String,
      nextAction: String,
      nextActionDate: Date
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);