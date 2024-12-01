const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  quantity: Number,
  price: Number,
  total: Number,
  category: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
