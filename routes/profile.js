// routes/profile.js
const { Router } = require("express");
const path        = require("path");
const multer      = require("multer");
const Profile     = require("../models/profile");
const User=require("../models/user");

const Payment=require("../models/payment");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/uploads"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

const router = Router();

router.get("/profileEdit", (req, res) => {
  res.render("profileEdit");
});
router.post(
  "/profileEdit",
  upload.single("uploadImage"), 
                 // ← ensures req.locals.user exists
  async (req, res, next) => {
    try {
      const userId = res.user._id;
      const { phonenumber } = req.body;

      if (!req.file) {
        return res.status(400).send("Please upload an image");
      }

      // build the public URL (Express.static serves /public as root)
      const imgPath = `/uploads/${req.file.filename}`;

      // find the existing profile by user or create a new one
      await Profile.findOneAndUpdate(
        { user: userId },                       // query
        { phonenumber, uploadImage: imgPath },  // updated fields
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.redirect("/users/profile");
    } catch (err) {
      next(err);
    }
  }
);

router.get("/profile", async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    const user=await User.findById(res.user._id);
    if (!profile) {
      return res.redirect("/users/profileEdit");
    }
    res.render("profile", { profile ,user});
  } catch (err) {
    next(err);
  }
});



router.get('/my-orders',  async (req, res) => {
    const orders=await Payment.find({user:res.user._id}) .sort({ createdAt: -1 })         // newest orders first
      .lean();
     return res.render("userorders",{
      pageTitle: 'All Orders',
      orders
     })
});


router.delete('/my-orders/:id', async (req, res, next) => {
  try {
    // 1) Remove the order document
    await Payment.findByIdAndDelete(res.params.id);

    // 2) Redirect back to the orders list
    res.redirect('/my-orders/');
  } catch (err) {
    next(err);
  }
});
module.exports = router;
