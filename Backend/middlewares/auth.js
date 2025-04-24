const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token; 

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } 
  catch (err) {
    res.redirect("/login");
  }
}


function ensureAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

function isVolunteer(req, res, next) {
  if (req.user && req.user.role === "volunteer") {
    return next(); 
  }
  return res.status(403).json({ message: "Access denied, you are not a volunteer" }); 
}

function isDonor(req, res, next) {
  if (req.user && req.user.role === "donor") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, you are not a donor" }); 
}

module.exports = { ensureAuth, isVolunteer, isDonor, verifyToken };
