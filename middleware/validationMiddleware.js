const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (request, response, next) => {
  const errors = validationResult(request);
  
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Validation rules for user registration
const validateUserRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('emailAddress')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('accountType')
    .isIn(['personal', 'business', 'savings'])
    .withMessage('Account type must be personal, business, or savings'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateUserLogin = [
  body('emailAddress')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for balance update
const validateBalanceUpdate = [
  body('amount')
    .isFloat({ min: -1000000, max: 1000000 })
    .withMessage('Amount must be a number between -1,000,000 and 1,000,000')
    .custom((value) => {
      if (value === 0) {
        throw new Error('Amount cannot be zero');
      }
      return true;
    }),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  handleValidationErrors
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('accountType')
    .optional()
    .isIn(['personal', 'business', 'savings'])
    .withMessage('Account type must be personal, business, or savings'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBalanceUpdate,
  validateProfileUpdate,
  handleValidationErrors
};
