const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['credit', 'debit'],
      message: 'Transaction type must be either credit or debit'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [1000000, 'Amount cannot exceed 1,000,000']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [3, 'Description must be at least 3 characters long'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'General'
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  balanceBefore: {
    type: Number,
    default: 0
  },
  balanceAfter: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, transactionType: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ transactionDate: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return this.transactionType === 'credit' ? `+$${this.amount.toFixed(2)}` : `-$${this.amount.toFixed(2)}`;
});

// Virtual for transaction age
transactionSchema.virtual('transactionAge').get(function() {
  return Math.floor((Date.now() - this.transactionDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate balance changes
transactionSchema.pre('save', async function(next) {
  try {
    const User = require('./User');
    const user = await User.findById(this.userId);
    
    if (!user) {
      return next(new Error('User not found'));
    }

    // Only calculate balance changes for new transactions
    if (this.isNew) {
      this.balanceBefore = user.currentBalance;
      
      if (this.transactionType === 'credit') {
        this.balanceAfter = user.currentBalance + this.amount;
      } else {
        if (user.currentBalance < this.amount) {
          return next(new Error('Insufficient funds for this transaction'));
        }
        this.balanceAfter = user.currentBalance - this.amount;
      }

      // Update user balance
      user.currentBalance = this.balanceAfter;
      await user.save();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-remove middleware to reverse balance changes
transactionSchema.pre('remove', async function(next) {
  try {
    const User = require('./User');
    const user = await User.findById(this.userId);
    
    if (!user) {
      return next(new Error('User not found'));
    }

    // Reverse the transaction effect
    if (this.transactionType === 'credit') {
      user.currentBalance -= this.amount;
    } else {
      user.currentBalance += this.amount;
    }

    await user.save();
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get transactions with pagination and filtering
transactionSchema.statics.getTransactionsWithFilters = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    transactionType,
    category,
    startDate,
    endDate,
    sortBy = 'transactionDate',
    sortOrder = 'desc'
  } = options;

  // Build filter query
  const filterQuery = { userId, isActive: true };

  if (transactionType) {
    filterQuery.transactionType = transactionType;
  }

  if (category) {
    filterQuery.category = { $regex: category, $options: 'i' };
  }

  if (startDate || endDate) {
    filterQuery.transactionDate = {};
    if (startDate) {
      filterQuery.transactionDate.$gte = new Date(startDate);
    }
    if (endDate) {
      filterQuery.transactionDate.$lte = new Date(endDate);
    }
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Build sort object
  const sortObject = {};
  sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute queries
  const [transactions, totalCount] = await Promise.all([
    this.find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'fullName emailAddress'),
    this.countDocuments(filterQuery)
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    transactions,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalCount,
      hasNextPage,
      hasPrevPage,
      limit: parseInt(limit)
    }
  };
};

// Instance method to update transaction
transactionSchema.methods.updateTransaction = async function(updateData) {
  const allowedUpdates = ['description', 'category', 'transactionDate'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  Object.assign(this, updates);
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);
