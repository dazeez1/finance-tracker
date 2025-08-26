const express = require('express');
const router = express.Router();

const {
  registerNewUser,
  authenticateUserLogin,
  getCurrentUserProfile
} = require('../controllers/authController');

const {
  validateUserRegistration,
  validateUserLogin
} = require('../middleware/validationMiddleware');

const { protectRoute } = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
// @desc    Register a new user account
// @access  Public
router.post('/signup', validateUserRegistration, registerNewUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT token
// @access  Public
router.post('/login', validateUserLogin, authenticateUserLogin);

// @route   GET /api/auth/profile
// @desc    Get current user profile (protected route)
// @access  Private
router.get('/profile', protectRoute, getCurrentUserProfile);

module.exports = router;
