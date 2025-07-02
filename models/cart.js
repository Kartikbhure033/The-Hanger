const { Schema, model } = require("mongoose");

const CartItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId,
    ref: "shop", 
    required: true 
    },
  quantity: { 
    type: Number,
     default: 1 
    },
});

const CartSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId,
    ref: "user", 
    required: true,
    unique: true 
    },
  items: [CartItemSchema],
}, { timestamps: true });

module.exports = model("Cart", CartSchema);