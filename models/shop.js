const mongoose=require("mongoose");

const ShopSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    Stock:{
        type:String,
        required:true,
    },
    Size:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    material:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    careInstruction:{
        type:String,
        required:true,
    },
    Description:{
        type:String,
        required:true,
    },
    uploadimage:{
        type:String,
        required:true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
});

const Shop=mongoose.model("shop",ShopSchema);

module.exports=Shop;