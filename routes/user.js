const Router=require("express");
const User=require("../models/user");


const router=Router();


router.get("/signin",(req,res)=>{
    return res.render("signin");
});

router.post("/signin",async(req,res)=>{
    const {fullname,email,password}=req.body;
    await User.create({
        fullname,email,password,role: "user"
    });
    return res.render("login");
});

router.get("/login",async(req,res)=>{
    return res.render("login");
});


router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const token=await User.matchedpasswordandGenerateToken(email,password);
    console.log(token);
    return res.cookie("token",token).redirect("/sell/shop");
});

router.get("/logout",(req, res) => {
    res.clearCookie("token"); // Replace 'token' with your cookie name if different
    return res.redirect("/user/login"); // Or wherever you want to redirect after logout
});


module.exports=router;