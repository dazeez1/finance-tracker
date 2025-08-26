const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Create a new transaction
const createNewTransaction = async (request, response) => {
  try {
    const { transactionType, amount, description, category, transactionDate } = request.body;
    const userId = request.authenticatedUser._id;

    // Create new transaction
    const newTransaction = new Transaction({
      userId,
      transactionType,
      amount: parseFloat(amount),
      description,
      category: category || 'General',
      transactionDate: transactionDate ? new Date(transactionDate) : new Date()
    });

    await newTransaction.save();

    // Get updated user balance
    const updatedUser = await User.findById(userId).select('currentBalance');

    const transactionData = {
      transactionId: newTransaction._id,
      transactionType: newTransaction.transactionType,
      amount: newTransaction.amount,
      formattedAmount: newTransaction.formattedAmount,
      description: newTransaction.description,
      category: newTransaction.category,
      transactionDate: newTransaction.transactionDate,
      balanceBefore: newTransaction.balanceBefore,
      balanceAfter: newTransaction.balanceAfter,
      currentBalance: updatedUser.currentBalance
    };

    response.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transaction: transactionData
      }
    });

  } catch (error) {
    console.error('Create transaction error:', error.message);
    
    if (error.message === 'Insufficient funds for this transaction') {
      return response.status(400).json({
        success: false,
        message: 'Insufficient funds for this transaction'
      });
    }

    if (error.name === 'ValidationError') {
      return response.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    response.status(500).json({
      success: false,
      message: 'Failed to create transaction. Please try again.'
    });
  }
};

// Get all transactions with pagination and filtering
const getAllTransactions = async (request, response) => {
  try {
    const userId = request.authenticatedUser._id;
    const {
      page = 1,
      limit = 10,
      transactionType,
      category,
      startDate,
      endDate,
      sortBy = 'transactionDate',
      sortOrder = 'desc'
    } = request.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return response.status(400).json({
        success: false,
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.'
      });
    }

    // Validate date parameters
    if (startDate && isNaN(Date.parse(startDate))) {
      return response.status(400).json({
        success: false,
        message: 'Invalid start date format'
      });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return response.status(400).json({
        success: false,
        message: 'Invalid end date format'
      });
    }

    // Get transactions with filters
    const result = await Transaction.getTransactionsWithFilters(userId, {
      page: pageNum,
      limit: limitNum,
      transactionType,
      category,
      startDate,
      endDate,
      sortBy,
      sortOrder
    });

    // Format transaction data
    const formattedTransactions = result.transactions.map(transaction => ({
      transactionId: transaction._id,
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      formattedAmount: transaction.formattedAmount,
      description: transaction.description,
      category: transaction.category,
      transactionDate: transaction.transactionDate,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      transactionAge: transaction.transactionAge,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));

    response.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: formattedTransactions,
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions. Please try again.'
    });
  }
};

// Get a single transaction by ID
const getTransactionById = async (request, response) => {
  try {
    const { transactionId } = request.params;
    const userId = request.authenticatedUser._id;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
      isActive: true
    });

    if (!transaction) {
      return response.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transactionData = {
      transactionId: transaction._id,
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      formattedAmount: transaction.formattedAmount,
      description: transaction.description,
      category: transaction.category,
      transactionDate: transaction.transactionDate,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      transactionAge: transaction.transactionAge,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    };

    response.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        transaction: transactionData
      }
    });

  } catch (error) {
    console.error('Get transaction error:', error.message);
    
    if (error.name === 'CastError') {
      return response.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    response.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction. Please try again.'
    });
  }
};

// Update a transaction
const updateTransaction = async (request, response) => {
  try {
    const { transactionId } = request.params;
    const userId = request.authenticatedUser._id;
    const { description, category, transactionDate } = request.body;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
      isActive: true
    });

    if (!transaction) {
      return response.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update transaction
    await transaction.updateTransaction({
      description,
      category,
      transactionDate: transactionDate ? new Date(transactionDate) : undefined
    });

    const updatedTransactionData = {
      transactionId: transaction._id,
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      formattedAmount: transaction.formattedAmount,
      description: transaction.description,
      category: transaction.category,
      transactionDate: transaction.transactionDate,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      transactionAge: transaction.transactionAge,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    };

    response.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: {
        transaction: updatedTransactionData
      }
    });

  } catch (error) {
    console.error('Update transaction error:', error.message);
    
    if (error.name === 'CastError') {
      return response.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return response.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    response.status(500).json({
      success: false,
      message: 'Failed to update transaction. Please try again.'
    });
  }
};

// Delete a transaction (soft delete)
const deleteTransaction = async (request, response) => {
  try {
    const { transactionId } = request.params;
    const userId = request.authenticatedUser._id;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
      isActive: true
    });

    if (!transaction) {
      return response.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Soft delete by setting isActive to false
    transaction.isActive = false;
    await transaction.save();

    // Get updated user balance
    const updatedUser = await User.findById(userId).select('currentBalance');

    response.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {
        deletedTransactionId: transaction._id,
        currentBalance: updatedUser.currentBalance
      }
    });

  } catch (error) {
    console.error('Delete transaction error:', error.message);
    
    if (error.name === 'CastError') {
      return response.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    response.status(500).json({
      success: false,
      message: 'Failed to delete transaction. Please try again.'
    });
  }
};

// Get transaction statistics
const getTransactionStats = async (request, response) => {
  try {
    const userId = request.authenticatedUser._id;
    const { startDate, endDate } = request.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }
    }

    const baseQuery = { userId, isActive: true };
    if (Object.keys(dateFilter).length > 0) {
      baseQuery.transactionDate = dateFilter;
    }

    // Get statistics
    const [totalTransactions, creditTransactions, debitTransactions] = await Promise.all([
      Transaction.countDocuments(baseQuery),
      Transaction.aggregate([
        { $match: { ...baseQuery, transactionType: 'credit' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $match: { ...baseQuery, transactionType: 'debit' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);

    const creditStats = creditTransactions[0] || { total: 0, count: 0 };
    const debitStats = debitTransactions[0] || { total: 0, count: 0 };

    const stats = {
      totalTransactions,
      creditTransactions: {
        count: creditStats.count,
        totalAmount: creditStats.total
      },
      debitTransactions: {
        count: debitStats.count,
        totalAmount: debitStats.total
      },
      netAmount: creditStats.total - debitStats.total
    };

    response.status(200).json({
      success: true,
      message: 'Transaction statistics retrieved successfully',
      data: {
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Get transaction stats error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction statistics. Please try again.'
    });
  }
};

module.exports = {
  createNewTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
