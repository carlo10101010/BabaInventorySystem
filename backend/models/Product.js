const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  productID: String,
  productSold: Number,
  date: Date,
  category: String, // Ensure this field exists
});

module.exports = mongoose.model('Product', productSchema);
