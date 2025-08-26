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

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - emailAddress
 *               - accountType
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 pattern: '^[a-zA-Z\\s]+$'
 *                 example: "John Doe"
 *                 description: User's full name (letters and spaces only)
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *                 description: User's email address
 *               accountType:
 *                 type: string
 *                 enum: [personal, business, savings]
 *                 example: "personal"
 *                 description: Type of account
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'
 *                 example: "SecurePass123"
 *                 description: Password (min 6 chars, must contain lowercase, uppercase, and number)
 *     responses:
 *       201:
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/signup', validateUserRegistration, registerNewUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - password
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 example: "SecurePass123"
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials or account deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateUserLogin, authenticateUserLogin);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile (protected route)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', protectRoute, getCurrentUserProfile);

module.exports = router;
