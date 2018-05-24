const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const Product = require('./product')

const userSchema = new Schema({
  name: String,
  email: 
  {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: 
  {
    type: String,
    required: true,
  },
  googleID: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  cart_id: [ {type: Schema.Types.ObjectId, ref: "Product"} ],
  creditCards: []
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
//comment