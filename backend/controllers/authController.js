const User = require('../models/User'); // Assuming you have a User model for session handling
const jwt = require('jsonwebtoken');  // For JWT-based authentication

// Logout Controller
const logout = (req, res) => {
  try {
    // If you're using JWT-based authentication, you can invalidate the token by simply removing it from the client.
    // Since JWT is stateless, the server doesn't need to track the sessions.

    // Clear JWT token from cookies (or you can use local storage on the client-side)
    res.clearCookie('token');  // Remove the JWT token from cookies (if you store the token in cookies)
    
    // Optionally, you can also handle session clearing if you're using sessions:
    // req.session.destroy();

    // Send a response to indicate successful logout
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

module.exports = { logout };
