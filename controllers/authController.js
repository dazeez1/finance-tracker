const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

// Register a new user account
const registerNewUser = async (request, response) => {
  try {
    const { fullName, emailAddress, accountType, password } = request.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(emailAddress);
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Create new user
    const newUser = new User({
      fullName,
      emailAddress,
      accountType,
      passwordHash: password // Will be hashed by pre-save middleware
    });

    await newUser.save();

    // Generate JWT token
    const authToken = generateToken(newUser._id);

    // Update last login date
    newUser.lastLoginDate = new Date();
    await newUser.save();

    // Return user data (excluding password)
    const userData = {
      userId: newUser._id,
      fullName: newUser.fullName,
      emailAddress: newUser.emailAddress,
      accountType: newUser.accountType,
      currentBalance: newUser.currentBalance,
      accountCreatedDate: newUser.accountCreatedDate,
      accountAge: newUser.accountAge
    };

    response.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Finance Tracker.',
      data: {
        user: userData,
        authToken
      }
    });

  } catch (error) {
    console.error('User registration error:', error.message);
    
    if (error.code === 11000) {
      return response.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    response.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.'
    });
  }
};

// Authenticate user login
const authenticateUserLogin = async (request, response) => {
  try {
    const { emailAddress, password } = request.body;

    // Find user by email
    const userAccount = await User.findByEmail(emailAddress);
    if (!userAccount) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // Check if account is active
    if (!userAccount.isAccountActive) {
      return response.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await userAccount.comparePassword(password);
    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // Generate JWT token
    const authToken = generateToken(userAccount._id);

    // Update last login date
    userAccount.lastLoginDate = new Date();
    await userAccount.save();

    // Return user data
    const userData = {
      userId: userAccount._id,
      fullName: userAccount.fullName,
      emailAddress: userAccount.emailAddress,
      accountType: userAccount.accountType,
      currentBalance: userAccount.currentBalance,
      lastLoginDate: userAccount.lastLoginDate,
      accountAge: userAccount.accountAge
    };

    response.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      data: {
        user: userData,
        authToken
      }
    });

  } catch (error) {
    console.error('User login error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Get current user profile
const getCurrentUserProfile = async (request, response) => {
  try {
    const userProfile = request.authenticatedUser;

    const profileData = {
      userId: userProfile._id,
      fullName: userProfile.fullName,
      emailAddress: userProfile.emailAddress,
      accountType: userProfile.accountType,
      currentBalance: userProfile.currentBalance,
      lastLoginDate: userProfile.lastLoginDate,
      accountCreatedDate: userProfile.accountCreatedDate,
      accountAge: userProfile.accountAge,
      isAccountActive: userProfile.isAccountActive
    };

    response.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: profileData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error.message);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve profile. Please try again.'
    });
  }
};

module.exports = {
  registerNewUser,
  authenticateUserLogin,
  getCurrentUserProfile
};
