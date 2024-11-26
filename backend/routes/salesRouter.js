const express = require('express');
const router = express.Router();
const Sale = require('../models/Sales'); // Assuming the Sale model is here

// POST route to add sales data
router.post('/', async (req, res) => {
    try {
        const newSale = new Sale(req.body);
        await newSale.save();
        res.status(201).json({ message: 'Sales added successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding sale', error: err.message });
    }
});

// GET route to fetch all sales data
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching sales', error: err.message });
    }
});

// GET route to fetch sales data by product ID
router.get('/:productID', async (req, res) => {
    try {
        const sales = await Sale.find({ productID: req.params.productID });
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching sales by product ID', error: err.message });
    }
});

// GET route to fetch distinct categories from the sales collection
router.get('/categories', async (req, res) => {
    try {
        const categories = await Sale.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// GET route to fetch sales data with optional filters (category and date range)
router.get('/filter', async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;

        // Initialize filter object
        let filter = {};

        // Add category filter if provided
        if (category) {
            filter.category = category; // Assuming 'category' is a field in the Sale model
        }

        // Add date range filter if provided
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),  // Greater than or equal to start date
                $lte: new Date(endDate)     // Less than or equal to end date
            };
        }

        // Fetch sales data from the database based on filters
        const sales = await Sale.find(filter);
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching sales data with filters', error: err.message });
    }
});

// PUT route to update sales data (example: update quantity sold)
router.put('/:id', async (req, res) => {
    try {
        const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(updatedSale);
    } catch (err) {
        res.status(500).json({ message: 'Error updating sale', error: err.message });
    }
});
module.exports = router;
