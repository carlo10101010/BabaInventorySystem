const Sales = require('../models/Sale');

// Get all sales data
exports.getSales = async (req, res) => {
    try {
        const sales = await Sales.find()
            .populate('productId', 'name') // Populating the product name from productId
            .exec();

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sales data', error });
    }
};

// Add a new sale
exports.addSale = async (req, res) => {
    try {
        const { productId, name, quantity, price, category, date } = req.body;
        const newSale = new Sales({
            productId, // Referencing the Product model
            name,
            quantity,
            price,
            total: price * quantity,
            category,
            date
        });

        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ message: 'Error adding sale', error });
    }
};

// Update an existing sale
exports.updateSale = async (req, res) => {
    try {
        const { saleId } = req.params;
        const updatedSale = await Sales.findByIdAndUpdate(saleId, req.body, { new: true });
        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sale', error });
    }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
    try {
        const { saleId } = req.params;
        const deletedSale = await Sales.findByIdAndDelete(saleId);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sale', error });
    }
};
