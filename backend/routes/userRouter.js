const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Update user details
router.put('/update', async (req, res) => {
  const { userId, username, email, password } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Update user fields
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;

      await user.save();
      res.json({ message: 'User updated successfully', user });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
8
module.exports = router;
