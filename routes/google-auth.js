require('dotenv').config();
const Router=require("express");
const passport=require("passport");
require("../middlewares/authentication");

const router=Router();

router.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
 
router.get( '/auth/google/callback',
    passport.authenticate( 'google', {session:false,failureRedirect:"/auth/failure",failureFlash: true}),
    (req,res)=>{
        res.user = req.user;
        res.cookie("token",res.user.token,{httpOnly:true,secure:false});
        res.redirect("/sell/shop");
    });


router.get("/auth/failure",(req,res)=>{
console.error("Google OAuth Error:", req.flash("error")[0] || req.query.error);
  res.status(400).send("Google authentication failed. Check server logs for details.");
});


module.exports=router;