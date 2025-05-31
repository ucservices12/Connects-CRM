const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an organization name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be more than 20 characters']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    logo: {
      type: String
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'standard', 'pro', 'enterprise'],
      default: 'free'
    },
    planFeatures: {
      maxEmployees: {
        type: Number,
        default: 10 // Free plan limit
      },
      maxStorage: {
        type: Number,
        default: 1 // GB for free plan
      },
      modules: {
        crm: { type: Boolean, default: false },
        attendance: { type: Boolean, default: true },
        leaves: { type: Boolean, default: true },
        assets: { type: Boolean, default: false },
        tasks: { type: Boolean, default: true },
        reports: { type: Boolean, default: false }
      }
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'suspended'],
      default: 'active'
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now
    },
    subscriptionEndDate: {
      type: Date
    },
    billingInfo: {
      name: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Middleware to set plan features based on subscription plan
OrganizationSchema.pre('save', function(next) {
  if (this.isModified('subscriptionPlan')) {
    switch (this.subscriptionPlan) {
      case 'free':
        this.planFeatures = {
          maxEmployees: 10,
          maxStorage: 1,
          modules: {
            crm: false,
            attendance: true,
            leaves: true,
            assets: false,
            tasks: true,
            reports: false
          }
        };
        break;
      case 'standard':
        this.planFeatures = {
          maxEmployees: 50,
          maxStorage: 5,
          modules: {
            crm: true,
            attendance: true,
            leaves: true,
            assets: true,
            tasks: true,
            reports: false
          }
        };
        break;
      case 'pro':
        this.planFeatures = {
          maxEmployees: 200,
          maxStorage: 20,
          modules: {
            crm: true,
            attendance: true,
            leaves: true,
            assets: true,
            tasks: true,
            reports: true
          }
        };
        break;
      case 'enterprise':
        this.planFeatures = {
          maxEmployees: 1000,
          maxStorage: 100,
          modules: {
            crm: true,
            attendance: true,
            leaves: true,
            assets: true,
            tasks: true,
            reports: true
          }
        };
        break;
    }
  }
  next();
});

// Reverse populate with virtuals
OrganizationSchema.virtual('employees', {
  ref: 'User',
  localField: '_id',
  foreignField: 'organization',
  justOne: false
});

module.exports = mongoose.model('Organization', OrganizationSchema);