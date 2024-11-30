const Product = require("../models/Product");

// Generate a unique ID for the product
const generateUniqueId = async () => {
  const lastProduct = await Product.findOne().sort({ _id: -1 });
  const lastId = lastProduct ? parseInt(lastProduct.id, 10) : 0;
  return (lastId + 1).toString(); // Unique ID generation based on the last product's ID
};

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, category, stock, threshold } = req.body;
  try {
    const id = await generateUniqueId(); // Generate unique ID for the new product
    const newProduct = new Product({
      id,
      name,
      category,
      stock,
      threshold,
      status: stock > threshold ? "In Stock" : stock === 0 ? "Out of Stock" : "Low Stock",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // Send the saved product as response
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, stock, threshold } = req.body;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      {
        name,
        category,
        stock,
        threshold,
        status: stock > threshold ? "In Stock" : stock === 0 ? "Out of Stock" : "Low Stock",
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findOneAndDelete({ id });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Fetch product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};
