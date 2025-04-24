const express = require("express");
const router = express.Router();
const Food = require("../models/food");
const {ensureAuth} = require('../middlewares/auth');
const { reserveFood } = require("../controllers/foodController");


router.get("/list-food", ensureAuth, (req, res) => {
    res.render("listFood", { user: req.user });
});


router.get("/available-food", async (req, res) => {
    try {
      const foodItems = await Food.find();  
      res.render("availablefood", { foodItems });
    } catch (error) {
        console.error("❌ Error fetching food items:", error);
        res.status(500).send("Error fetching food items.");
    }
});


router.get('/pickup-location', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const availableFood = await Food.find({expiryDate: { $gte: today },status:"available",});
      
        res.render('volunteerMap', {
        availableFood,
        googleApiKey: process.env.GOOGLE_API_KEY,
        reservedFood:null ,
      });
    } 
    catch (error) {
      res.status(500).send("Failed to load map");
    }
});
  

module.exports = router;
