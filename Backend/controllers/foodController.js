const Food = require("../models/food");
const axios = require("axios");
require("dotenv").config();
const {getCoordinatesFromAddress}=require("../services/geocodeService");
const user =require("../models/User")
const sendSMS = require("../services/smsService");

const listFood = async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const { name, quantity, expiryDate, address, priority } = req.body;

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const geoUrl = "https://maps.googleapis.com/maps/api/geocode/json";

    const geoResponse = await axios.get(geoUrl, {
      params: {
        address: address,
        key: apiKey,
      },
    });

    const geoData = geoResponse.data;

    if (geoData.status !== "OK" || !geoData.results.length) {
      return res.status(400).send("Invalid address. Could not fetch coordinates.");
    }

    const location = geoData.results[0].geometry.location; // lat & lng
    const formattedAddress = geoData.results[0].formatted_address;

    const latitude = location.lat;
    const longitude = location.lng;
    
    const expiry = new Date(expiryDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Auto-priority logic: Set priority if expiry date is tomorrow or manually marked as priority
    const isPriority = priority === 'true' || expiry.toDateString() === tomorrow.toDateString();

    const food = new Food({
      name,
      quantity,
      expiryDate,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      address: formattedAddress,
      user: req.user.id,
      priority: isPriority,
    });

    await food.save();

    res.redirect('/available-food');  
  } catch (error) {
    console.error("Error listing food:", error.message);
    res.status(500).send("Error listing food.");
  }
};

const postListFood = async (req, res) => {
  if(!req.user){
    return res.status(401).json({error:"Unauthorized !"})
  }

  try {
    const { name, quantity, expiryDate, address, priority } = req.body;
    const { lat, lng } = await getCoordinatesFromAddress(address);

    const expiry = new Date(expiryDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Auto-priority logic: Set priority if expiry date is tomorrow or manually marked as priority
    const isPriority = priority === 'true' || expiry.toDateString() === tomorrow.toDateString();
    
    const newFood = new Food({
      name,
      quantity,
      expiryDate,
      location: {
        type: 'Point',
        coordinates: [lng, lat], 
      },
      address,
      user:req.user.id,
      priority: isPriority,
    });

    await newFood.save();
    res.status(201).json({ message: "Food listed for donation successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to list food: " + error.message });
  }
};


const getAvailableFood = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const foodItems = await Food.find({
        expiryDate: { $gte: today },
        status:'available', 
      }).sort({ priority: -1, expiryDate: 1 });
      
      const role = req.user.role;
      res.render('availablefood', {
        foodItems,
        googleApiKey: process.env.GOOGLE_API_KEY,
        userRole: role,
        currentUserId: req.user.id
      });
    } catch (err) {
      console.error('Error fetching available food:', err);
      res.status(500).send('Server error');
    }
};

const getMyDonations = async (req, res) => {
  try {
    const donations = await Food.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.render("listFood", {
      googleApiKey: process.env.GOOGLE_API_KEY,
      donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error.message);
    res.status(500).send("Failed to load your donations.");
  }
};


const reserveFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id) // donor

    if (!food || food.status !== "available") {
      return res.status(400).send("Food not available");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    food.status = "reserved";
    food.reservedBy = req.user.id;
    food.otp = otp;
    await food.save();
    res.redirect("/volunteer-dashboard");

  } catch (err) {
    console.error("Reserve error:", err);
    res.status(500).send("Server Error");
  }
};


const markAsDelivered = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);

    if (!food || food.status !== 'picked') {
      return res.status(400).json({ message: 'Food not in reserved state' });
    }
    if(!food.otpVerified || !food.isCollected){
      return res.status(400).json({message:"Donor has not marked this food as collected yet"})
    }

    food.status = 'delivered';
    food.deliveredAt = new Date();
    await food.save();
    res.redirect("/volunteer-dashboard");
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const markAsCollected = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food || food.user.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized");
    }

    if (!food.otpVerified) {
      return res.status(400).send("OTP not verified yet");
    }

    food.status='picked';
    food.isCollected = true;
    await food.save();
    res.redirect("/list-food");
  } catch (err) {
    console.error("Mark as Collected Error:", err);
    res.status(500).send("Server error");
  }
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const food = await Food.findOne({
      otp,
      reservedBy: req.user.id
    });

    if (!food) {
      return res.status(404).send("No matching food found for this OTP.");
    }

    food.otpVerified = true;
    food.otp = null; 
    await food.save();

    res.redirect("/volunteer-dashboard");
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).send("Server error");
  }
};


const volunteerDashboard = async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availableFood = await Food.find({ status: 'available',expiryDate:{$gte :today}});
    const myReservedFood = await Food.find({ 
      reservedBy: req.user.id, 
      status: {$in:['reserved','picked']}, 
    });


    res.render('volunteerDashboard', {
      availableFood,
      myReservedFood,
      user: req.user,
      googleApiKey: process.env.GOOGLE_API_KEY
    });


  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).send('Server Error');
  }
};

const cancelReservation = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food || food.reservedBy.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized");
    }

    food.status = "available";
    food.reservedBy = null;
    await food.save();

    res.redirect('/volunteer-dashboard');
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).send('Server Error');
  }
};

const locationOfDonor =  async (req, res) => {
  try {
    const foodId = req.params.id;
    const volunteerId = req.user.id; // From JWT or session

    const food = await Food.findById(foodId);

    if (!food || food.status !== "available") {
      return res.status(400).send("Food already picked or reserved");
    }

    food.status = "reserved";
    food.reservedBy = volunteerId;
    await food.save();

    const allAvailableFood = await Food.find({ status: 'available' });

    res.render('volunteerMap', {
      availableFood: allAvailableFood,
      googleApiKey: process.env.GOOGLE_API_KEY,
      reservedFood: food || null ,// Pass the reserved food for route drawing
    });
   
  } catch (error) {
    console.error("Error picking up food:", error);
    res.status(500).send("Internal Server Error");
  }
};

const viewHistory = async (req, res) => {
  try {
    const history = await Food.find({
      reservedBy: req.user.id,
      status: "delivered",
      deliveredAt: { $ne: null }
    }).sort({ deliveredAt: -1 });

    res.render("volunteerHistory", { 
      history,
      user: req.user 
    });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).send("Server error");
  }
};


const deleteFood=async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).send("Food not found");
  if (food.status === "Delivered") return res.status(403).send("Cannot delete delivered food");
  if (food.user.toString() !== req.user.id) return res.status(403).send("Unauthorized");

  await food.deleteOne();
  res.redirect("/dashboard");
};


const editFoodGet =async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).send("Food not found");
  if (food.status === "Delivered") return res.status(403).send("Cannot edit delivered food");
  if (food.user.toString() !== req.user.id) return res.status(403).send("Unauthorized");

  res.render("editFood", { food });
};


const editFoodPost = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).send("Food not found");
  if (food.status === "Delivered") return res.status(403).send("Cannot update delivered food");
  if (food.user.toString() !== req.user.id) return res.status(403).send("Unauthorized");

  food.name = req.body.name;
  food.quantity = req.body.quantity;
  food.expiryDate = req.body.expiryDate;
  food.address = req.body.address;
  await food.save();

  res.redirect("/dashboard");
};


const markPriority = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await Food.findById(foodId);
    
    if (!food) {
      return res.status(404).send('Food not found');
    }

    // Mark as priority
    food.priority = true;
    await food.save();

    res.redirect('/list-food'); // Redirect to the food listing page after updating
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


module.exports = {
    listFood,
    getAvailableFood,
    postListFood,
    reserveFood,
    getMyDonations,
    markAsDelivered,
    volunteerDashboard,
    cancelReservation,
    viewHistory,
    locationOfDonor,
    markAsCollected,
    deleteFood,
    editFoodGet,
    editFoodPost,
    verifyOtp,
    markPriority,
};
