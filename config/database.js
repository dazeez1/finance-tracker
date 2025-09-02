const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const connectionString =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/Finance-tracker';

    console.log(
      '🔗 Connecting to MongoDB:',
      connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
    );

    await mongoose.connect(connectionString);

    console.log('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', error => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
