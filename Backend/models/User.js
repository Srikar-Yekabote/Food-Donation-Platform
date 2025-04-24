const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["donor", "Volunteer"],
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Instance method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Optional: Instance method to generate JWT token
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      user: {
        id: this._id,
        email: this.email,
        role: this.role,
      }
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const User = mongoose.model("user", userSchema);
module.exports = User;
