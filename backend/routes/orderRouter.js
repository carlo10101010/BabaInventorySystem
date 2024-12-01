const express = require("express");
const { getProducts, getCategories, confirmOrder } = require("../controllers/orderController");

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/categories", getCategories);
router.post("/sales/confirm", confirmOrder);

module.exports = router;
