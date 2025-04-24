const express=require("express");
const Food=require("../models/food");
const router =express.Router();
const {listFood,
    getAvailableFood,
    postListFood,
    getMyDonations,
    reserveFood,
    markAsDelivered,cancelReservation,
    volunteerDashboard,
    locationOfDonor,
    viewHistory,
    markAsCollected,
    deleteFood,
    editFoodGet,
    editFoodPost,
    verifyOtp,markPriority } =require("../controllers/foodController");
const {verifyToken,isVolunteer,ensureAuth}=require('../middlewares/auth');



router.get("/list-food", ensureAuth,getMyDonations); 
router.post('/list-food', verifyToken, listFood); 
router.get('/available-food',ensureAuth,getAvailableFood);
router.post('/list-food', postListFood);
router.post("/food/:id/reserve", isVolunteer,locationOfDonor);
router.post("/food/:id/collected", verifyToken,markAsCollected);
router.post("/food/:id/deliver",isVolunteer,markAsDelivered)
router.get('/edit-food/:id', ensureAuth, editFoodGet);
router.post('/edit-food/:id', ensureAuth,editFoodPost);
router.post('/delete-food/:id', ensureAuth,deleteFood);
router.get('/volunteer-dashboard',ensureAuth,volunteerDashboard);
router.post('/pickup/:id', isVolunteer,reserveFood);
router.post('/cancel-pickup/:id', isVolunteer, cancelReservation);
router.get('/volunteer-history', isVolunteer, viewHistory);
router.post('/verify-otp/:id',ensureAuth,verifyOtp);
router.post('/food/:id/priority',ensureAuth,markPriority);
module.exports = router;