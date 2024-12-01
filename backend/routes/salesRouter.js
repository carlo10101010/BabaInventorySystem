const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Get all sales
router.get('/', salesController.getSales);

// Add a new sale
router.post('/', salesController.addSale);

// Update an existing sale by ID
router.put('/:saleId', salesController.updateSale);

// Delete a sale by ID
router.delete('/:saleId', salesController.deleteSale);

module.exports = router;
