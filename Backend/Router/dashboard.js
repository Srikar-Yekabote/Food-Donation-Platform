const express = require("express");
const router = express.Router();
const Food = require("../models/food");
const { ensureAuth } = require("../middlewares/auth");

router.get("/dashboard", ensureAuth, async (req, res) => {
    try {
      const userFood = await Food.find({
        user: req.user._id,  // Make sure you are filtering by the correct user
        status: { $ne: "delivered" }
      });
  
      // Fetch available food for the donor (non-reserved by the user)
      const availableFood = await Food.find({
        status: { $in: ["available", "reserved", "picked"] },
        user: { $ne: req.user._id } 
      });
  
      res.render('dashboard', {
        user: req.user,
        userFood, // Pass the user's food list with OTP
        availableFood, // Include available food for display
      });
  
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).send("Server Error");
    }
  });


module.exports = router;
