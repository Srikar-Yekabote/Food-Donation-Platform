const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: undefined
        }
    },
    address: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        default: null
    },
    status: {
        type: String,
        enum: ['available', 'reserved', 'delivered', 'picked'],
        default: "available",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    isCollected: {
        type: Boolean,
        default: false,
    },
    otp: String,
    otpVerified: {
        type: Boolean,
        default: false
    },
    isDonorConfirmed: {
        type: Boolean,
        default: false
    },

    // Priority flag to manually mark food as a priority
    priority: {
        type: Boolean,
        default: false   
    },
    // Auto-priority flag which could be triggered by expiry or other conditions
    autoPriority: {
        type: Boolean,
        default: false   
    }
});

// Geospatial index for location-based search
foodSchema.index({ location: "2dsphere" });

// Virtual field for priority status combining both manual and auto-priority
foodSchema.virtual('isPriority').get(function () {
    // Return true if either manually set priority or auto-priority is enabled
    return this.priority || this.autoPriority;
});

// Model and export
const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
