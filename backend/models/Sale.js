const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
