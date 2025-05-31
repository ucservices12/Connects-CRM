const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  employeeId: {
    type: String,
    required: [true, 'Please add an employee ID'],
    unique: true,
    trim: true
  },
  personalDetails: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    bloodGroup: String,
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String
    }
  },
  employmentDetails: {
    designation: String,
    department: String,
    reportsTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    jobDescription: String,
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern']
    },
    workLocation: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    panNumber: String
  },
  documents: [
    {
      name: String,
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);