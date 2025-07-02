require('dotenv').config();
const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const cookieParser = require('cookie-parser');
const passport=require("passport");
const Razorpay = require('razorpay');
const methodOverride = require('method-override');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

const app=express();
const port=process.env.PORT || 9000;

const userRoute=require("./routes/user");
const protected=require("./routes/shop");
const authRoute=require("./routes/google-auth");
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const profileRoute=require("./routes/profile");
const adminRoutes= require("./routes/Admin"); 
const AddressRoute=require("./routes/Address");
const{checkTokenForUser,requireLogin}=require("./middlewares/authentication")



app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(methodOverride('_method'));
app.use(checkTokenForUser);


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/user",userRoute);
app.use("/sell",requireLogin,protected);
app.use("/",authRoute);
app.use('/cart', requireLogin,cartRoutes);
app.use('/payment', requireLogin,paymentRoutes);
app.use("/users",requireLogin,profileRoute);
app.use("/admin",requireLogin,adminRoutes);
app.use("/checkout",requireLogin,AddressRoute);




  app.get("/",checkTokenForUser,(req,res)=>{
    return res.render("index",{user:res.user});
  })


mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("MongoDb Started"));

app.listen(port,()=>console.log(`Server started at port:${port}`));
