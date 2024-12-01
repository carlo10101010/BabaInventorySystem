const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  status: { type: String, enum: ["In Stock", "Out of Stock", "Low Stock"], required: true },
});

module.exports = mongoose.model("Product", productSchema);
