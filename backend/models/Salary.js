const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  month: {
    type: Number,
    required: [true, 'Please add a month'],
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: [true, 'Please add a year']
  },
  basicSalary: {
    type: Number,
    required: [true, 'Please add basic salary']
  },
  allowances: {
    hra: {
      type: Number,
      default: 0
    },
    conveyance: {
      type: Number,
      default: 0
    },
    medical: {
      type: Number,
      default: 0
    },
    special: {
      type: Number,
      default: 0
    }
  },
  deductions: {
    pf: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    professionalTax: {
      type: Number,
      default: 0
    },
    loan: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  bonus: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number
  },
  totalDeductions: {
    type: Number
  },
  netPay: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  transactionId: {
    type: String
  },
  comments: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total earnings, deductions, and net pay before saving
SalarySchema.pre('save', function(next) {
  // Calculate total earnings
  this.totalEarnings = this.basicSalary + 
    this.allowances.hra + 
    this.allowances.conveyance + 
    this.allowances.medical + 
    this.allowances.special + 
    this.bonus;

  // Calculate total deductions
  this.totalDeductions = this.deductions.pf + 
    this.deductions.tax + 
    this.deductions.professionalTax + 
    this.deductions.loan + 
    this.deductions.other;

  // Calculate net pay
  this.netPay = this.totalEarnings - this.totalDeductions;

  next();
});

module.exports = mongoose.model('Salary', SalarySchema);