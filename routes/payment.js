// File: /routes/payment.js
const { Router } = require('express');
const router = Router();
const { createOrder, verifyPayment } = require('../controllers/payment');


router.post('/create-order',  createOrder);
router.post('/verify',  verifyPayment);

module.exports = router;
