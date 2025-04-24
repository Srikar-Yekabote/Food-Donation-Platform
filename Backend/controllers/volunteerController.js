const Volunteer = require("../models/volunteer");
const bcrypt = require("bcrypt");
const Food = require('../models/food');
const Coupon = require("../models/coupon");

const registerVolunteer = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await Volunteer.findOne({ email });
        if (existingUser) {
            return res.render("volunteerRegister", {
                error: "Volunteer with this email already exists."
            });
        }

        const newVolunteer = new Volunteer({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await newVolunteer.save();
        res.redirect("/login");
    } catch (err) {
        console.error("Error registering volunteer:", err);
        res.render("volunteerRegister", {
            error: "Error registering volunteer: " + err.message
        });
    }
};

function generateCouponCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const getVolunteerAnalytics = async (req, res) => {
    try {
        const volunteerId = req.user.id;

        const [volunteer, totalPicked, delivered, avgPickupTime, pendingPickups] = await Promise.all([
            Volunteer.findById(volunteerId).lean(),
            Food.countDocuments({ reservedBy: volunteerId }),
            Food.countDocuments({ reservedBy: volunteerId, status: 'delivered' }),
            Food.aggregate([
                {
                    $match: {
                        reservedBy: volunteerId,
                        status: 'delivered',
                        pickupTime: { $exists: true },
                        deliveredAt: { $exists: true }
                    }
                },
                {
                    $project: {
                        duration: {
                            $divide: [
                                { $subtract: ['$deliveredAt', '$pickupTime'] },
                                1000 * 60
                            ]
                        }
                    }
                },
                { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
            ]),
            Food.countDocuments({ reservedBy: volunteerId, status: { $in: ['reserved', 'picked'] } }),
        ]);

        const averagePickupTime = avgPickupTime[0]?.avgDuration?.toFixed(2) || 0;

        let reward = null;
        let couponCode = null;
        const goal = 2;
        const weeklyPickups = delivered;

        const existingCoupon = await Coupon.findOne({ volunteerId });
        let redeemed = false;

        if (weeklyPickups >= goal) {
            if (!existingCoupon) {
                const newCouponCode = generateCouponCode();
                const newCoupon = new Coupon({
                    volunteerId,
                    code: newCouponCode,
                    milestone: reward
                });
                await newCoupon.save();
                couponCode = newCouponCode;
            } else {
                couponCode = existingCoupon.code;
            }
        }

        if (delivered >= 5) {
            reward = "Platinum Hero";
        } else if (delivered >= 4) {
            reward = "Gold Champion";
        } else if (delivered >= 3) {
            reward = "Silver Contributor";
        } else if (delivered >= 2) {
            reward = "Bronze Helper";
        }
        const redeemedRewards = volunteer.redeemedRewards || [];
        if (redeemedRewards.some(r => r.couponCode === couponCode)) {
            redeemed = true;
        }

        res.render('volunteerAnalytics', {
            totalPicked,
            delivered,
            averagePickupTime,
            pendingPickups,
            user: req.user,
            reward,
            couponCode,
            goal,
            weeklyPickups,
            redeemedRewards,
            redeemed  // Pass this flag
        });
    } catch (error) {
        console.error('Volunteer analytics error:', error);
        res.status(500).send('Internal Server Error');
    }
};




const redeemReward = async (req, res) => {
    const { milestone, couponCode } = req.body;
    const volunteerId = req.user.id;
    try {
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }
        if (!Array.isArray(volunteer.redeemedRewards)) {

            volunteer.redeemedRewards = [];
        }
        const alreadyRedeemed = volunteer.redeemedRewards.some(
            r => r.milestone === parseInt(milestone)
        );
        if (alreadyRedeemed) {
            return res.status(400).json({ message: "Reward already redeemed." });
        }
        volunteer.redeemedRewards.push({
            milestone: parseInt(milestone),
            couponCode,
            redeemedAt: new Date()
        });
        await volunteer.save();
        res.json({ message: "Reward redeemed successfully!" });
    } catch (err) {
        console.error("Redeem error:", err);
        res.status(500).json({ message: "Error redeeming reward" });
    }
};



module.exports = {
    registerVolunteer,
    getVolunteerAnalytics,
    redeemReward,
};
