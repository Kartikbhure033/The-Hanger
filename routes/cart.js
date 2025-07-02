const express = require('express');
const router = express.Router();

const {
  viewCart,
  addToCart,
  updateCart,
  removeFromCart
  ,} = require('../controllers/cart');


  
router.get('/',  viewCart);


router.post('/add/:productId',  addToCart);


router.post('/update/:itemId',  updateCart);


router.post('/remove/:itemId', removeFromCart);

module.exports = router;