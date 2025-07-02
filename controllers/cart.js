const Cart = require('../models/cart');

async function viewCart(req, res) {
  try {
    // 1) Fetch & populate
    const cart = await Cart
      .findOne({ user: res.user._id })
      .populate('items.product');

    // 2) If no cart exists yet, render empty
    if (!cart) {
      return res.render('cart', {
        user: res.user,
        items: [],
        total: 0
      });
    }

    // 3) Filter out items whose product wasn't found (deleted or bad ID)
    const validItems = cart.items.filter(item => item.product);

    // 4) Compute total safely
    const total = validItems.reduce((sum, item) => {
      // fallback price = 0 if missing
      const price = (typeof item.product.price === 'number') ? item.product.price : 0;
      return sum + price * item.quantity;
    }, 0);

    // 5) Render with the cleaned-up list
    return res.render('cart', {
      user: res.user,
      items: validItems,
      total
    });

  } catch (err) {
    console.error('viewCart error:', err);
    return res.status(500).send('Server Error');
  }
}



async function addToCart(req, res) {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: res.user._id });

    if (!cart) {
      cart = await Cart.create({ user: res.user._id, items: [] });
    }

    const idx = cart.items.findIndex(i => i.product.equals(productId));

    if (idx > -1) {
      cart.items[idx].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return res.redirect('/cart');

  } catch (err) {
    console.error('addToCart error:', err);
    return res.status(500).send('Server Error');
  }
}



async function updateCart(req, res) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: res.user._id });
    if (!cart) return res.redirect('/cart');

    const item = cart.items.id(itemId);
    if (item) {
      item.quantity = Math.max(1, parseInt(quantity, 10) || 1);
      await cart.save();
    }

    return res.redirect('/cart');

  } catch (err) {
    console.error('updateCart error:', err);
    return res.status(500).send('Server Error');
  }
}



async function removeFromCart(req, res) {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: res.user._id });
    if (!cart) return res.redirect('/cart');

    cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    await cart.save();

    return res.redirect('/cart');

  } catch (err) {
    console.error('removeFromCart error:', err);
    return res.status(500).send('Server Error');
  }
}



module.exports = {
  viewCart,
  addToCart,
  updateCart,
  removeFromCart,
};
