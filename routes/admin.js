// routes/admin.js
const { Router } = require("express");
const User    = require("../models/user");
const Shop    = require("../models/shop");
const Payment = require("../models/payment");


const router = Router();

router.get("/", async (req, res, next) => {
  try {
    // 1) Total registered users
    const totalUsers = await User.countDocuments();


    // 3) Total profiles (should match users if every user has a profile)
    const totalProfiles = await Shop.countDocuments();

    // 4) Total products in your shop
    const totalProducts = await Payment.countDocuments();

    // 5) Total revenue (sum of all payments.amount)
    const revenueAgg = await Payment.aggregate([
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } }
    ]);
    const totalRevenuePaise = revenueAgg[0]?.totalPaid || 0;
    // convert from paise to rupees and format with commas
    const totalRevenue = `₹ ${(totalRevenuePaise/100).toLocaleString("en-IN")}`;

    res.render("adminPanel", {
      stats: {
        users:    totalUsers,
        
        profiles: totalProfiles,
        products: totalProducts,
        revenue:  totalRevenue
      }
    });
  } catch (err) {
    next(err);
  }
});


// routes/admin.js
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { users }); // Points to admin/users.ejs
  } catch (err) {
    next(err);
  }
});


router.get("/products", async (req, res) => {
  try {
    const products = await Shop.find();
    res.render("productAdmin", { products 
  }); // Points to admin/users.ejs
  } catch (err) {
    next(err);
  }
});


router.get('/orders', async (req, res) => {
  try {
    const orders = await Payment.find().sort({ createdAt: -1 });
    res.render('orders', {
      pageTitle: 'All Orders',
      orders
    });
  } catch (error) {
    console.log('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/all-products', async (req, res) => {
  try {
    const products = await Shop.find().sort();
    res.render('all-products', {
      pageTitle: 'All Products',
      products
    });
  } catch (error) {
    console.log('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.redirect('/admin/all-products');
  } catch (err) {
    next(err);
  }
});


// DELETE /admin/orders/:id
router.delete('/orders/:id', async (req, res, next) => {
  try {
    // 1) Remove the order document
    await Payment.findByIdAndDelete(req.params.id);

    // 2) Redirect back to the orders list
    res.redirect('/admin/orders');
  } catch (err) {
    next(err);
  }
});







module.exports = router;
