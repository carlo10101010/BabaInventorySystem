const createPurchaseOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Logic to save the purchase order
    const newOrder = {
      items,
      totalAmount,
      createdAt: new Date(),
    };

    res.status(201).json({ message: 'Purchase order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPurchaseOrder,
};
