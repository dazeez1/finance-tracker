const express = require('express');
const router = express.Router();

const {
  getUserProfileAndBalance,
  updateUserProfile,
  getCurrentBalance,
  updateUserBalance
} = require('../controllers/userController');

const {
  validateProfileUpdate,
  validateBalanceUpdate
} = require('../middleware/validationMiddleware');

const { protectRoute } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protectRoute);

// @route   GET /api/users/profile
// @desc    Get user profile and balance
// @access  Private
router.get('/profile', getUserProfileAndBalance);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateProfileUpdate, updateUserProfile);

// @route   GET /api/users/balance
// @desc    Get current balance
// @access  Private
router.get('/balance', getCurrentBalance);

// @route   PUT /api/users/balance
// @desc    Update balance
// @access  Private
router.put('/balance', validateBalanceUpdate, updateUserBalance);

module.exports = router;
