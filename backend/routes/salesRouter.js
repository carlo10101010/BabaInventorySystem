const express = require("express");
const { confirmOrder } = require("../controllers/salesController");

const router = express.Router();

// Confirm order and update stock
router.post("/confirm", confirmOrder);

module.exports = router;
