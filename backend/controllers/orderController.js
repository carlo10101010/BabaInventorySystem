const Sale = require('../models/Sale');
const Product = require('../models/Product');  // Assuming the correct Product model is used

// Confirm order and save to sales collection
exports.confirmOrder = async (req, res) => {
  const { orderList } = req.body;

  if (!orderList || orderList.length === 0) {
    return res.status(400).json({ message: 'No items in the order list' });
  }

  try {
    // Save each item in the order list to the sales collection
    const salesPromises = orderList.map(async (item) => {
      // Check if product exists in the products collection
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Save sale to the sales collection
      const sale = new Sale({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,  // Passed from frontend
        total: item.total,  // Price * Quantity
        category: item.category,
      });

      await sale.save();
    });

    // Wait for all sales to be saved
    await Promise.all(salesPromises);

    return res.status(200).json({ message: 'Order confirmed and saved successfully' });
  } catch (error) {
    console.error('Error confirming order:', error);
    return res.status(500).json({ message: 'Error confirming order', error: error.message });
  }
};
