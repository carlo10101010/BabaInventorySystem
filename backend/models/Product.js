// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  status: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
