const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [50, 'Full name cannot exceed 50 characters']
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required'],
    enum: {
      values: ['personal', 'business', 'savings'],
      message: 'Account type must be either personal, business, or savings'
    },
    default: 'personal'
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  currentBalance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  isAccountActive: {
    type: Boolean,
    default: true
  },
  lastLoginDate: {
    type: Date,
    default: null
  },
  accountCreatedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for account age
userSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.accountCreatedDate) / (1000 * 60 * 60 * 24));
});

// Index for better query performance
userSchema.index({ accountType: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to update balance
userSchema.methods.updateBalance = function(amount) {
  this.currentBalance += amount;
  if (this.currentBalance < 0) {
    throw new Error('Insufficient funds');
  }
  return this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function(emailAddress) {
  return this.findOne({ emailAddress: emailAddress.toLowerCase() });
};

// Static method to get users by account type
userSchema.statics.findByAccountType = function(accountType) {
  return this.find({ accountType, isAccountActive: true });
};

module.exports = mongoose.model('User', userSchema);
