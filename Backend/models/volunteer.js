const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "volunteer"
    },
    redeemedRewards:[{
        milestone: Number, // e.g., 5, 10, 20, 30
        couponCode: String,
        redeemedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Volunteer", volunteerSchema);
