// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const salesRouter = require('./routes/salesRouter');  // This line imports the sales route
const authRouter = require('./routes/authRouter');  // Adjust path if needed
const accountRouter = require('./routes/accountRouter');
const purchaseOrderRouter = require('./routes/productRouter');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());  // Body parser middleware to parse JSON request body
app.use(cors());          // CORS for cross-origin requests


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
app.use('/api/account', accountRouter);
app.use('/api/products', productRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
