const Shop=require("../models/shop");
const multer  = require('multer');
const path=require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

async function Addproducts(req,res){
    const {productname, price, Stock, Size,color,category,material,
        brand,careInstruction,Description,}=req.body;
    const product=await Shop.create({
         productname,
        price,
        Stock,
        Size,
        color,
        category,
        material,
        brand,
        careInstruction,
        Description,
        createdBy: res.user._id,
        uploadimage:`/uploads/${req.file.filename}`
    });
      return res.redirect(`/sell/${product._id}`); 
};

module.exports={
    Addproducts,
    upload,
};