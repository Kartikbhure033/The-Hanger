const Router=require("express");
const{Addproducts,upload,}=require("../controllers/shop");
const Shop = require("../models/shop");
const mongoose=require("mongoose");


const router=Router();

router.get("/shop",async(req,res)=>{
    const { search= '', sort = 'new' } = req.query;

  // Build filter
  const filter = {};
  if (search) {const regex ={ $regex: search, $options: 'i' };
    filter.$or = [
      { category: regex },
      { productname: regex },
    ];
  } 

  // Determine sort criteria
  let sortCriteria;
  switch (sort) {
    case 'new':
      sortCriteria = { createdAt: -1 };
      break;
    case 'priceLow':
      sortCriteria = { price: 1 };
      break;
    case 'priceHigh':
      sortCriteria = { price: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  const products = await Shop.find(filter)
    .sort(sortCriteria);

  res.render('shop', { products, search, sort });
});

router.get("/Add-product",(req,res)=>{
    return res.render("Add-product");
});

router.post("/Add-product",upload.single('uploadimage'),Addproducts)

router.get("/:id",async(req,res)=>{
    const { id } = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid product ID");
  }
    const product = await Shop.findById(id);
  if (!product) {
    
    return res.status(404).render("404", { message: "Product not found" });
  }
   return res.render("product", { product });
});

module.exports=router;