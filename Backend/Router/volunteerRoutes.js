const express = require("express");
const router = express.Router();
const { registerVolunteer, getVolunteerAnalytics, redeemReward } = require("../controllers/volunteerController");
const { isVolunteer } = require("../middlewares/auth");
const { viewHistory } = require("../controllers/foodController");

router.get("/volRegister", (req, res) => {
    res.render("volunteerRegister");
});

router.post("/volRegister", registerVolunteer);
router.get("/volunteer-history", isVolunteer, viewHistory);
router.get("/volunteer-analytics", isVolunteer, getVolunteerAnalytics);
router.post("/redeem", isVolunteer, redeemReward);

module.exports = router;
