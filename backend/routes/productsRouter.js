const express = require("express");
const { getProducts, addProduct, getCategories } = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.get("/categories", getCategories);

module.exports = router;