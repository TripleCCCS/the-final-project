const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

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
  // passwordConf: {
  //   type: String,
  //   required: true,
  // },
  googleID: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  cart_id: [],
  credit: String

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;