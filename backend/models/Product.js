const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique ID for each product
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
