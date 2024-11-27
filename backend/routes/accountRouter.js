// routes/accountRouter.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Route to get user details by ID
router.get('/account/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from URL parameter

    // Search the database for a user with the provided ID
    const user = await User.findById(userId);

    // If no user is found, send an error message
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is found, send the user details (excluding password for security)
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to update user details by ID
router.put('/account/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from the URL parameter
    const { username, email, password } = req.body; // Get new user details from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If new username is provided, update it
    if (username) {
      user.username = username;
    }

    // If new email is provided, update it
    if (email) {
      user.email = email;
    }

    // If a new password is provided, hash and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      user.password = hashedPassword;
    }

    // Save the updated user information to the database
    await user.save();

    // Send success response
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
