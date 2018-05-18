const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const creditSchema = new Schema({
  number: String,
  mailing_address: String,
  expiration: String,
  ccv: String,


}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;