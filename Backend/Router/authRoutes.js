const express=require("express");
const { ensureAuth } = require("../middlewares/auth"); // <-- import the middleware
const router=express.Router();

const {getRegister,
    getDashboard,
    getLogin,
    postRegister,
    postLogin,
    logout,}=require("../controllers/authController");

router.get("/register", getRegister);
router.post("/register", postRegister);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/logout", logout);
router.get("/dashboard",ensureAuth,getDashboard);

module.exports =router;