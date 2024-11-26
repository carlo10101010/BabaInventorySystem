const User = require('../models/User');

// Controller to get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Get user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Return user data
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to update user
const updateUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find user by ID and update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        password: password || undefined, // Only update password if provided
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserById, updateUser };
