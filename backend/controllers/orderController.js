const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { orderList } = req.body;

    if (!orderList || orderList.length === 0) {
      return res.status(400).json({ message: "Order list is empty" });
    }

    const updatedProducts = [];

    for (const order of orderList) {
      const product = await Product.findById(order.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${order.productId}` });
      }

      if (product.stock < order.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      product.stock -= order.quantity;

      if (product.stock <= 0) {
        product.status = "Out of Stock";
      } else if (product.stock <= product.threshold) {
        product.status = "Low Stock";
      } else {
        product.status = "In Stock";
      }

      await product.save();

      updatedProducts.push({
        productId: product._id,
        name: product.name,
        quantity: order.quantity,
        price: product.price,
        total: product.price * order.quantity,
        category: product.category,
        date: new Date(),
      });
    }

    const sale = new Sale({
      ...updatedProducts,
      date: new Date(),
    });
    await sale.save();

    res.status(201).json({ message: "Order confirmed and saved", sale });
  } catch (error) {
    res.status(500).json({ message: "Error confirming order", error });
  }
};
