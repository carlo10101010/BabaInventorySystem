// routes/productRouter.js
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products); // Return the products as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

module.exports = router;
