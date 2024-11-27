const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productID: { type: String, required: true },
    productSold: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true }, // Category field added
});

const Sale = mongoose.model('Sales', SaleSchema);
module.exports = Sale;
