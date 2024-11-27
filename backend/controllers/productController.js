const Product = require('../models/Product'); // Import the Product model

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products); // Return products as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { productName, productID, productSold, category, price } = req.body;

    // Validate input
    if (!productName || !productID || !category || price == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new product
    const newProduct = new Product({
      productName,
      productID,
      productSold: productSold || 0, // Default to 0 if not provided
      category,
      price,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // Return the saved product
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID from the URL
    const updates = req.body; // Updates from the request body

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated fields
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct); // Return the updated product
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID from the URL

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export the controller functions
module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
