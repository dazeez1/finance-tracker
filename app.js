const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Import Swagger configuration
const swaggerSpecs = require('./config/swagger');

// Create Express app
const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting with different limits for different endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
  })
);

// Body parsing middleware with input sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware
app.use((request, response, next) => {
  // Sanitize request body
  if (request.body) {
    Object.keys(request.body).forEach(key => {
      if (typeof request.body[key] === 'string') {
        request.body[key] = request.body[key].trim();
      }
    });
  }

  // Sanitize query parameters
  if (request.query) {
    Object.keys(request.query).forEach(key => {
      if (typeof request.query[key] === 'string') {
        request.query[key] = request.query[key].trim();
      }
    });
  }

  next();
});

// Request logging middleware
app.use((request, response, next) => {
  console.log(
    `${new Date().toISOString()} - ${request.method} ${request.path}`
  );
  next();
});

// Health check endpoint
app.get('/health', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'Finance Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Debug endpoint to test validation
app.post('/debug/signup', (request, response) => {
  console.log('🔍 Debug signup request body:', request.body);
  console.log('🔍 Debug signup request headers:', request.headers);

  response.status(200).json({
    success: true,
    message: 'Debug endpoint - check server logs',
    receivedData: request.body,
    headers: request.headers,
  });
});

// Test database connection endpoint
app.get('/test-db', async (request, response) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;

    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    response.status(200).json({
      success: true,
      message: 'Database connection test',
      connectionState: states[connectionState] || 'unknown',
      readyState: connectionState,
      databaseName: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message,
    });
  }
});

// Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Finance Tracker API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  })
);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static frontend files
app.use(express.static('public'));

// Serve frontend for all non-API routes
app.get('*', (request, response) => {
  // Skip API routes and health check
  if (request.path.startsWith('/api') || request.path === '/health') {
    return response.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  }

  // Serve the frontend HTML file
  response.sendFile('index.html', { root: 'public' });
});

// Global error handler
app.use((error, request, response, next) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(
      err => err.message
    );
    return response.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return response.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  response.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

module.exports = app;
