const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer", required: true },
  code: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
  isRedeemed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Coupon", couponSchema);