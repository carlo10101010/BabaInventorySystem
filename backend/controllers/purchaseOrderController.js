const PurchaseOrder = require('../models/Product');

// Create a new purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    const { itemName, unitPrice, quantity, total } = req.body;
    const newOrder = new PurchaseOrder({ itemName, unitPrice, quantity, total });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase order', error });
  }
};

// Get all purchase orders
const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving purchase orders', error });
  }
};

// Delete a purchase order
const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await PurchaseOrder.findByIdAndDelete(id);
    res.status(200).json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase order', error });
  }
};

module.exports = { createPurchaseOrder, getPurchaseOrders, deletePurchaseOrder };
