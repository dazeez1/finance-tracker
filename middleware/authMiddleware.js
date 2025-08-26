const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const protectRoute = async (request, response, next) => {
  let token;

  // Check if token exists in headers
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = request.headers.authorization.split(' ')[1];

      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token
      const authenticatedUser = await User.findById(decodedToken.userId).select('-passwordHash');
      
      if (!authenticatedUser) {
        return response.status(401).json({
          success: false,
          message: 'User not found or token is invalid'
        });
      }

      if (!authenticatedUser.isAccountActive) {
        return response.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      // Attach user to request object
      request.authenticatedUser = authenticatedUser;
      next();

    } catch (error) {
      console.error('Token verification error:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }

      return response.status(401).json({
        success: false,
        message: 'Authentication failed. Please login again.'
      });
    }
  }

  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }
};

// Middleware to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Optional middleware to check if user is authenticated (doesn't block if not)
const optionalAuth = async (request, response, next) => {
  try {
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      const token = request.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId).select('-passwordHash');
      
      if (user && user.isAccountActive) {
        request.authenticatedUser = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }
  
  next();
};

module.exports = {
  protectRoute,
  generateToken,
  optionalAuth
};
