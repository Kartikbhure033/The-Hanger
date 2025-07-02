// File: /models/Payment.js
const { Schema, model } = require('mongoose');


const ProductSnapshotSchema = new Schema({
  product:   { type: Schema.Types.ObjectId, ref: 'shop', required: true },
  name:      { type: String, required: true },
  category:  { type: String },
  price:     { type: Number, required: true },
  image:     { type: String },            // URL or path
  quantity:  { type: Number, required: true }
});

const AddressSchema = new Schema({
  user:     { type: Schema.Types.ObjectId, ref: "user", required: true },
  fullName: { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zip:      { type: String, required: true },
  country:  { type: String, required: true },
  default:  { type: Boolean, default: false },
});

const PaymentSchema = new Schema({
   user:       { type: Schema.Types.ObjectId, ref: 'user', required: true },
  order_id:   { type: String, required: true },
  payment_id: { type: String, required: true },
  signature:  { type: String, required: true },
  amount:     { type: Number, required: true },
  currency:   { type: String, default: "INR" },
  status:     { type: String, default: "paid" },
  address:    { type: AddressSchema, required: true },
  created_at: { type: Date, default: Date.now },
  products:   [ProductSnapshotSchema],
}, {
   timestamps: true,
  });

module.exports = model('Payment', PaymentSchema);
