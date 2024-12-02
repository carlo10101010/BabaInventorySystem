const express = require('express');
const { getAccountDetails, updateAccountDetails } = require('../controllers/accountController');
const router = express.Router();

// Route to get user details
router.get('/users/:id', getAccountDetails);

// Route to update user details
router.put('/users/:id', updateAccountDetails);

module.exports = router;
