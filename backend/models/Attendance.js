const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  checkIn: {
    time: {
      type: Date
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    ipAddress: String
  },
  checkOut: {
    time: {
      type: Date
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    ipAddress: String
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'late', 'leave'],
    default: 'present'
  },
  workHours: {
    type: Number
  },
  comments: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate work hours when checking out
AttendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const checkInTime = new Date(this.checkIn.time);
    const checkOutTime = new Date(this.checkOut.time);
    const diffTime = Math.abs(checkOutTime - checkInTime);
    const diffHours = diffTime / (1000 * 60 * 60);
    
    this.workHours = parseFloat(diffHours.toFixed(2));
  }
  
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);