const User = require('../models/User');

// Get user profile and balance
const getUserProfileAndBalance = async (request, response) => {
  try {
    const currentUser = request.authenticatedUser;

    const userData = {
      userId: currentUser._id,
      fullName: currentUser.fullName,
      emailAddress: currentUser.emailAddress,
      accountType: currentUser.accountType,
      currentBalance: currentUser.currentBalance,
      lastLoginDate: currentUser.lastLoginDate,
      accountCreatedDate: currentUser.accountCreatedDate,
      accountAge: currentUser.accountAge,
      isAccountActive: currentUser.isAccountActive
    };

    response.status(200).json({
      success: true,
      message: 'User profile and balance retrieved successfully',
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile. Please try again.'
    });
  }
};

// Update user profile
const updateUserProfile = async (request, response) => {
  try {
    const { fullName, accountType } = request.body;
    const currentUser = request.authenticatedUser;

    // Update only provided fields
    if (fullName) {
      currentUser.fullName = fullName;
    }
    
    if (accountType) {
      currentUser.accountType = accountType;
    }

    await currentUser.save();

    const updatedUserData = {
      userId: currentUser._id,
      fullName: currentUser.fullName,
      emailAddress: currentUser.emailAddress,
      accountType: currentUser.accountType,
      currentBalance: currentUser.currentBalance,
      lastLoginDate: currentUser.lastLoginDate,
      accountCreatedDate: currentUser.accountCreatedDate,
      accountAge: currentUser.accountAge,
      isAccountActive: currentUser.isAccountActive
    };

    response.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUserData
      }
    });

  } catch (error) {
    console.error('Update profile error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again.'
    });
  }
};

// Get current balance
const getCurrentBalance = async (request, response) => {
  try {
    const currentUser = request.authenticatedUser;

    response.status(200).json({
      success: true,
      message: 'Balance retrieved successfully',
      data: {
        currentBalance: currentUser.currentBalance,
        currency: 'USD', // Default currency for now
        lastUpdated: currentUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Get balance error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve balance. Please try again.'
    });
  }
};

// Update balance
const updateUserBalance = async (request, response) => {
  try {
    const { amount, description } = request.body;
    const currentUser = request.authenticatedUser;

    // Calculate new balance
    const newBalance = currentUser.currentBalance + parseFloat(amount);
    
    // Check if balance would go negative
    if (newBalance < 0) {
      return response.status(400).json({
        success: false,
        message: 'Insufficient funds. Cannot reduce balance below zero.'
      });
    }

    // Update balance
    currentUser.currentBalance = newBalance;
    await currentUser.save();

    response.status(200).json({
      success: true,
      message: 'Balance updated successfully',
      data: {
        previousBalance: currentUser.currentBalance - parseFloat(amount),
        currentBalance: currentUser.currentBalance,
        amountChanged: parseFloat(amount),
        description: description || 'Balance adjustment',
        updatedAt: currentUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Update balance error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to update balance. Please try again.'
    });
  }
};

module.exports = {
  getUserProfileAndBalance,
  updateUserProfile,
  getCurrentBalance,
  updateUserBalance
};
