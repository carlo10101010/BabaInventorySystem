// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;  // Make sure MONGO_URI is loaded

    if (!mongoURI) {
      console.error('MongoDB URI is missing in .env');
      process.exit(1);  // Exit if MONGO_URI is not available
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
