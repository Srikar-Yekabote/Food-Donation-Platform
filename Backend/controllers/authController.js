const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Food = require("../models/food");
const Volunteer = require("../models/volunteer");

const getRegister = (req, res) => {
  res.render("register");
};

const postRegister = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists. Please use a different email.");
    }

    const newUser = new User({ name, email, password, role, phone });
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Registration Error:", error);
    res.render("register", { error: "Error registering the user" });
  }
};

const getLogin = (req, res) => {
  if (req.user) {
    if (req.user.role === "donor") {
      return res.redirect("/dashboard");
    } else if (req.user.role === "volunteer") {
      return res.redirect("/volunteer-dashboard");
    }
  }

  // 👇 Only render login if not already logged in
  res.render("login");
};

const postLogin = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = role === "volunteer"
      ? await Volunteer.findOne({ email })
      : await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).render("login", { error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure:process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    if (role === "volunteer") {
      return res.redirect("/volunteer-dashboard");
    } else {
      return res.redirect("/dashboard");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).render("login", { error: "Login failed. Try again." });
  }
};

const logout = (req, res) => {
  res.clearCookie("token"); // Clear the JWT cookie
  res.redirect("/login");
};

const getDashboard = async (req, res) => {
  try {
    const userFood = await Food.find();

    const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }

    res.render("dashboard", { user, userFood });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).send("Error loading the dashboard.");
  }
};

module.exports = {
  getRegister,
  getDashboard,
  getLogin,
  postRegister,
  postLogin,
  logout,
};
