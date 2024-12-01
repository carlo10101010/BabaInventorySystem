const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const salesRouter = require('./routes/salesRouter');  // This line imports the sales route
const authRouter = require('./routes/authRouter');  // Adjust path if needed
const accountRouter = require('./routes/accountRouter');
const productsRouter = require('./routes/productsRouter');
const orderRouter = require("./routes/orderRouter");

// Load environment variables from .env file
dotenv.config();

// Check if MONGO_URI is available
if (!process.env.MONGO_URI) {
  console.error('MongoDB URI is not set. Please make sure the .env file is correctly configured.');
  process.exit(1); // Exit if MongoDB URI is missing
}

const app = express();

// Middleware
app.use(express.json());  // Body parser middleware to parse JSON request body
app.use(cors()); // CORS for cross-origin requests
app.use(bodyParser.json()); // For parsing application/json

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve login.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'log.html'));
});

// Use the authRouter for authentication routes
app.use('/api/auth', authRouter);  // This will make '/register' available at '/api/auth/register'
app.use(authRouter); // This will support '/login' for POST requests
app.use('/', authRouter);         // Supports /login
app.use('/api/sales', salesRouter);
app.use('/api/products', productsRouter);
app.use("/api/sales", orderRouter);
app.use('/api/account', accountRouter);
app.use('/api', orderRouter);



// Connect to MongoDB without deprecated options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
