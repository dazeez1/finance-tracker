const app = require('./app');
const connectDatabase = require('./config/database');

// Load environment variables
require('dotenv').config();

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start server function
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log('🚀 Finance Tracker API server started successfully!');
      console.log(`📍 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log('📝 Available endpoints:');
      console.log('   POST /api/auth/signup - Register new user');
      console.log('   POST /api/auth/login - User login');
      console.log('   GET  /api/auth/profile - Get user profile');
      console.log('   GET  /api/users/profile - Get user profile & balance');
      console.log('   PUT  /api/users/profile - Update user profile');
      console.log('   GET  /api/users/balance - Get current balance');
      console.log('   PUT  /api/users/balance - Update balance');
      console.log('✨ Ready to handle requests!');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error.message);
  console.error('Stack:', error.stack);
  
  // Close server gracefully
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  
  // Close server gracefully
  process.exit(1);
});

// Start the server
startServer();
