const Product = require("../models/Product"); // Assuming you have a Product model
const Sale = require("../models/Sale"); // Assuming you create a Sale model

// Confirm and update stock
const confirmOrder = async (req, res) => {
  const { orderList } = req.body;

  if (!orderList || !Array.isArray(orderList) || orderList.length === 0) {
    return res.status(400).json({ message: "Order list is empty or invalid." });
  }

  try {
    // Update stock and save sales data
    const salesData = [];

    for (const item of orderList) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      // Check if stock is sufficient
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product: ${product.name}` });
      }

      // Update stock
      product.stock -= item.quantity;
      await product.save();

      // Prepare sales record
      salesData.push({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        category: item.category,
        date: new Date(),
      });
    }

    // Insert sales data
    await Sale.insertMany(salesData);

    res.status(200).json({ message: "Order confirmed and sales recorded successfully." });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ message: "Server error confirming order.", error: error.message });
  }
};

module.exports = {
  confirmOrder,
};
