const express = require('express');
const router = express.Router();

const {
  createNewTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');

const {
  validateTransactionCreation,
  validateTransactionUpdate
} = require('../middleware/validationMiddleware');

const { protectRoute } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protectRoute);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionType
 *               - amount
 *               - description
 *             properties:
 *               transactionType:
 *                 type: string
 *                 enum: [credit, debit]
 *                 example: "credit"
 *                 description: Type of transaction
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 1000000
 *                 example: 500.00
 *                 description: Transaction amount (must be positive)
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: "Salary deposit"
 *                 description: Transaction description
 *               category:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Income"
 *                 description: Transaction category (optional)
 *               transactionDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:30:00Z"
 *                 description: Transaction date (optional, defaults to current date)
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *                   example: "Transaction created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       properties:
 *                         transactionId:
 *                           type: string
 *                         transactionType:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         formattedAmount:
 *                           type: string
 *                         description:
 *                           type: string
 *                         category:
 *                           type: string
 *                         transactionDate:
 *                           type: string
 *                           format: date-time
 *                         balanceBefore:
 *                           type: number
 *                         balanceAfter:
 *                           type: number
 *                         currentBalance:
 *                           type: number
 *       400:
 *         description: Validation error or insufficient funds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.post('/', validateTransactionCreation, createNewTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions with pagination and filtering
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of transactions per page
 *       - in: query
 *         name: transactionType
 *         schema:
 *           type: string
 *           enum: [credit, debit]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (case-insensitive)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions until this date (YYYY-MM-DD)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [transactionDate, amount, createdAt]
 *           default: transactionDate
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                   example: "Transactions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           transactionId:
 *                             type: string
 *                           transactionType:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           formattedAmount:
 *                             type: string
 *                           description:
 *                             type: string
 *                           category:
 *                             type: string
 *                           transactionDate:
 *                             type: string
 *                             format: date-time
 *                           balanceBefore:
 *                             type: number
 *                           balanceAfter:
 *                             type: number
 *                           transactionAge:
 *                             type: number
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalCount:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *                         limit:
 *                           type: integer
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.get('/', getAllTransactions);

/**
 * @swagger
 * /api/transactions/stats:
 *   get:
 *     summary: Get transaction statistics
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Transaction statistics retrieved successfully
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
 *                   example: "Transaction statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: integer
 *                         creditTransactions:
 *                           type: object
 *                           properties:
 *                             count:
 *                               type: integer
 *                             totalAmount:
 *                               type: number
 *                         debitTransactions:
 *                           type: object
 *                           properties:
 *                             count:
 *                               type: integer
 *                             totalAmount:
 *                               type: number
 *                         netAmount:
 *                           type: number
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
router.get('/stats', getTransactionStats);

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   get:
 *     summary: Get a specific transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
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
 *                   example: "Transaction retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       properties:
 *                         transactionId:
 *                           type: string
 *                         transactionType:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         formattedAmount:
 *                           type: string
 *                         description:
 *                           type: string
 *                         category:
 *                           type: string
 *                         transactionDate:
 *                           type: string
 *                           format: date-time
 *                         balanceBefore:
 *                           type: number
 *                         balanceAfter:
 *                           type: number
 *                         transactionAge:
 *                           type: number
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid transaction ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
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
router.get('/:transactionId', getTransactionById);

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: "Updated salary deposit"
 *                 description: Transaction description
 *               category:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Salary"
 *                 description: Transaction category
 *               transactionDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:30:00Z"
 *                 description: Transaction date
 *     responses:
 *       200:
 *         description: Transaction updated successfully
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
 *                   example: "Transaction updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       properties:
 *                         transactionId:
 *                           type: string
 *                         transactionType:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         formattedAmount:
 *                           type: string
 *                         description:
 *                           type: string
 *                         category:
 *                           type: string
 *                         transactionDate:
 *                           type: string
 *                           format: date-time
 *                         balanceBefore:
 *                           type: number
 *                         balanceAfter:
 *                           type: number
 *                         transactionAge:
 *                           type: number
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error or invalid transaction ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
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
router.put('/:transactionId', validateTransactionUpdate, updateTransaction);

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction (soft delete)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
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
 *                   example: "Transaction deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedTransactionId:
 *                       type: string
 *                     currentBalance:
 *                       type: number
 *       400:
 *         description: Invalid transaction ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
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
router.delete('/:transactionId', deleteTransaction);

module.exports = router;
