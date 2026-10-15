const jwt = require("jsonwebtoken");
const User = require("../models/User");


// =====================================================
// CHECK LOGIN / JWT TOKEN
// =====================================================

const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }


    const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    const user = await User.findById(
      decoded.id
    ).select("-password");


    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }


    req.user = user;

    next();

  } catch (error) {

    console.error("Auth Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};



// =====================================================
// ADMIN ONLY
// =====================================================

const adminOnly = (req, res, next) => {

  if (
    req.user &&
    req.user.role === "admin"
  ) {
    next();
  } else {

    return res.status(403).json({
      message: "Admin access only.",
    });
  }
};


module.exports = {
  protect,
  adminOnly,
};