const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import the User model

// Middleware function to authenticate JWT token
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });  // If no token is provided
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using the secret key

    // Attach the user ID to the request object
    req.user = decoded.userId;
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });  // If the token is invalid
  }
};

module.exports = authMiddleware;