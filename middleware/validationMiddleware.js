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
    .isIn(['debit', 'credit'])
    .withMessage('Account type must be debit or credit'),
  
  body('password')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters long'),
  
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

// Validation rules for transaction creation
const validateTransactionCreation = [
  body('transactionType')
    .isIn(['credit', 'debit'])
    .withMessage('Transaction type must be either credit or debit'),
  
  body('amount')
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Amount must be a positive number between 0.01 and 1,000,000'),
  
  body('description')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Description must be between 3 and 200 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  
  body('transactionDate')
    .optional()
    .isISO8601()
    .withMessage('Transaction date must be a valid ISO 8601 date format'),
  
  handleValidationErrors
];

// Validation rules for transaction update
const validateTransactionUpdate = [
  body('description')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Description must be between 3 and 200 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  
  body('transactionDate')
    .optional()
    .isISO8601()
    .withMessage('Transaction date must be a valid ISO 8601 date format'),
  
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
    .isIn(['debit', 'credit'])
    .withMessage('Account type must be debit or credit'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBalanceUpdate,
  validateTransactionCreation,
  validateTransactionUpdate,
  validateProfileUpdate,
  handleValidationErrors
};
