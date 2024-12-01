const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to confirm and save the order
router.post('/confirm', orderController.confirmOrder);

module.exports = router;
