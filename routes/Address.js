// File: /routes/Address.js
const { Router } = require("express");
const Payment=require("../models/payment");

const router = Router();

router.get("/Address",  async (req, res) => {
  const addresses = await Payment.find({ user: res.user._id });
  return res.render("add", { user: res.user, addresses });
});

router.post("/Address",  async (req, res) => {
  // This route only handles “saving without payment” if you explicitly want that
  // In our flow, we no longer use this POST, because saving happens in /payment/verify
  const { fullName, street, city, state, zip, country } = req.body;
  await Payment.create({
    user:     res.user._id,
    fullName,
    street,
    city,
    state,
    zip,
    country,
    default: false
  });
  return res.redirect("/checkout/Address");
});

module.exports = router;
