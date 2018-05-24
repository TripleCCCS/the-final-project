const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const creditSchema = new Schema({
  name: String,
  cardnumber: String,
  cardexp: String,
  mailing_address: String,
  cvv: String,
  city: String,
  state: String,
  zip: String

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;