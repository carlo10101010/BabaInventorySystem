const express = require('express');
const router = express.Router();
const { createPurchaseOrder } = require('../controllers/purchaseOrderController'); // Import controller function

router.post('/', createPurchaseOrder); // Define the POST route

module.exports = router;
