const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./Router/authRoutes");
const foodRoutes = require("./Router/foodRoutes");
const viewsfoodRoutes = require("./Router/viewsfood");
const dashboardRoutes = require("./Router/dashboard");
const volunteerRoutes = require("./Router/volunteerRoutes");
const viewsFoodRoutes = require('./Router/viewsAnalytics');
const { verifyToken, ensureAuth } = require("./middlewares/auth");

const app = express();
const port = 5000;

// app.use(cors({
//   origin: ['http://localhost:3000'], // Your React app's URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

mongoose.connect("mongodb://127.0.0.1:27017/food-donation")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection Error:", err));


app.use(verifyToken);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ✅ Public and Auth Routes
app.use("/", authRoutes);
app.use("/", foodRoutes);
app.use("/", viewsfoodRoutes);
app.use("/", dashboardRoutes);
app.use("/",verifyToken ,volunteerRoutes);

app.use('/', viewsFoodRoutes);
app.get("/list-food", ensureAuth, (req, res) => {
  res.render("listFood");
});

app.listen(port, () => console.log(`Server Started At port http://localhost:${port}`));
