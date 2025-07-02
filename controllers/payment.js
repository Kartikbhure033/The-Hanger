// File: /controllers/payment.js
require('dotenv').config();
const Razorpay = require('razorpay');
const crypto   = require('crypto');

// Import your Mongoose models:
const Cart    = require('../models/cart');       // Make sure the path/casing matches
const Payment = require('../models/payment');


// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id:    process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── 1️⃣ CREATE ORDER ───────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart
      .findOne({ user: res.user._id })
      .populate('items.product');

    if (!cart || !cart.items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 1) Drop any items whose product didn't populate
    const validItems = cart.items.filter(i => i.product);

    if (!validItems.length) {
      return res.status(400).json({ error: 'No valid products in cart' });
    }

    // 2) Compute total in rupees, then to paise
    const amountInPaise = validItems
      .reduce((sum, i) => {
        const price = typeof i.product.price === 'number' ? i.product.price : 0;
        return sum + price * i.quantity;
      }, 0) * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);

    return res.json(order);

  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Unable to create order' });
  }
};
// ─── 2️⃣ VERIFY PAYMENT & SAVE ──────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  // Extract everything from the request body
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    fullName,
    street,
    city,
    state,
    zip,
    country,
    defaultAddress
  } = req.body;

  // 1. Recompute HMAC SHA256 signature
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
  }

  const cart = await Cart.findOne({ user: res.user._id }).populate('items.product');
if (!cart) return res.status(400).json({ status: 'failure', message: 'Cart not found' });

const validItems = cart.items.filter(i => i.product);

if (!validItems.length) {
  return res.status(400).json({ status: 'failure', message: 'No valid products in cart' });
}

const productSnapshots = validItems.map(i => ({
  product:  i.product._id,
  name:     i.product.productname || 'Unknown Product',
  category: i.product.category || 'General',
  price:    typeof i.product.price === 'number' ? i.product.price : 0,
  image:    i.product.uploadimage || '',
  quantity: i.quantity
}));

  try {
    // 2. Save Payment document
    await Payment.create({
        user:       res.user._id,
      order_id:   razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature:  razorpay_signature,
      amount:     amount,
      currency:   currency,
      status:     'paid',
       address: {
        user:     res.user._id,
        fullName: fullName,
        street:   street,
        city:     city,
        state:    state,
        zip:      zip,
        country:  country,
        default:  !!defaultAddress
      },
      products:   productSnapshots
    });


    return res.json({ status: 'success', message: 'Payment + address saved.' });
  } catch (err) {
    console.error('Error saving payment or address:', err);
    return res.status(500).json({ status: 'failure', message: 'Database error.' });
  }
};
