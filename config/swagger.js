const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description: 'A comprehensive personal finance management API with user authentication and balance tracking',
      contact: {
        name: 'Azeez Damilare Gbenga',
        email: 'support@financetracker.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'Unique user identifier'
            },
            fullName: {
              type: 'string',
              description: 'User\'s full name',
              example: 'John Doe'
            },
            emailAddress: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address',
              example: 'john.doe@example.com'
            },
            accountType: {
              type: 'string',
              enum: ['personal', 'business', 'savings'],
              description: 'Type of account'
            },
            currentBalance: {
              type: 'number',
              description: 'Current account balance',
              example: 1000.50
            },
            lastLoginDate: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            accountCreatedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            accountAge: {
              type: 'number',
              description: 'Account age in days'
            },
            isAccountActive: {
              type: 'boolean',
              description: 'Account status'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful! Welcome back.'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                authToken: {
                  type: 'string',
                  description: 'JWT authentication token'
                }
              }
            }
          }
        },
        BalanceResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Balance updated successfully'
            },
            data: {
              type: 'object',
              properties: {
                previousBalance: {
                  type: 'number',
                  example: 500.00
                },
                currentBalance: {
                  type: 'number',
                  example: 1000.00
                },
                amountChanged: {
                  type: 'number',
                  example: 500.00
                },
                description: {
                  type: 'string',
                  example: 'Salary deposit'
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            }
          }
        },
                 ErrorResponse: {
           type: 'object',
           properties: {
             success: {
               type: 'boolean',
               example: false
             },
             message: {
               type: 'string',
               example: 'Validation failed'
             },
             errors: {
               type: 'array',
               items: {
                 type: 'object',
                 properties: {
                   field: {
                     type: 'string',
                     example: 'emailAddress'
                   },
                   message: {
                     type: 'string',
                     example: 'Please provide a valid email address'
                   },
                   value: {
                     type: 'string',
                     example: 'invalid-email'
                   }
                 }
               }
             }
           }
         },
         Transaction: {
           type: 'object',
           properties: {
             transactionId: {
               type: 'string',
               description: 'Unique transaction identifier'
             },
             transactionType: {
               type: 'string',
               enum: ['credit', 'debit'],
               description: 'Type of transaction'
             },
             amount: {
               type: 'number',
               description: 'Transaction amount',
               example: 500.00
             },
             formattedAmount: {
               type: 'string',
               description: 'Formatted amount with sign',
               example: '+$500.00'
             },
             description: {
               type: 'string',
               description: 'Transaction description',
               example: 'Salary deposit'
             },
             category: {
               type: 'string',
               description: 'Transaction category',
               example: 'Income'
             },
             transactionDate: {
               type: 'string',
               format: 'date-time',
               description: 'Transaction date'
             },
             balanceBefore: {
               type: 'number',
               description: 'Balance before transaction'
             },
             balanceAfter: {
               type: 'number',
               description: 'Balance after transaction'
             },
             transactionAge: {
               type: 'number',
               description: 'Transaction age in days'
             },
             createdAt: {
               type: 'string',
               format: 'date-time',
               description: 'Creation timestamp'
             },
             updatedAt: {
               type: 'string',
               format: 'date-time',
               description: 'Last update timestamp'
             }
           }
         },
         TransactionStats: {
           type: 'object',
           properties: {
             totalTransactions: {
               type: 'integer',
               description: 'Total number of transactions'
             },
             creditTransactions: {
               type: 'object',
               properties: {
                 count: {
                   type: 'integer',
                   description: 'Number of credit transactions'
                 },
                 totalAmount: {
                   type: 'number',
                   description: 'Total credit amount'
                 }
               }
             },
             debitTransactions: {
               type: 'object',
               properties: {
                 count: {
                   type: 'integer',
                   description: 'Number of debit transactions'
                 },
                 totalAmount: {
                   type: 'number',
                   description: 'Total debit amount'
                 }
               }
             },
             netAmount: {
               type: 'number',
               description: 'Net amount (credits - debits)'
             }
           }
         }
      }
    },
           tags: [
         {
           name: 'Authentication',
           description: 'User registration and login endpoints'
         },
         {
           name: 'User Management',
           description: 'User profile and balance management endpoints'
         },
         {
           name: 'Transactions',
           description: 'Transaction CRUD operations and management'
         },
         {
           name: 'Health',
           description: 'System health check endpoint'
         }
       ]
  },
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
