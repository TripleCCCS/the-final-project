const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const productSchema = new Schema({
  id: String,
  quantity: String,
  size: String,
  image1: String,
  image2: String,
  image3: String,
  description: String,
  category: String,
  color: String,
  material: String,
  name: String,
  price: String,

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;