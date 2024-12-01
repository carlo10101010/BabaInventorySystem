const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Routes
router.get("/", productController.getAllProducts);
router.get("/categories", productController.getCategories);
router.get("/:id", productController.getProductById);
router.post("/", productController.addProduct);
router.put("/:id", productController.updateProduct);
router.patch("/restock/:id", productController.restockProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
