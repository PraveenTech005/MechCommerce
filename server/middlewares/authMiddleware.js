const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../auth/Controller");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = verifyToken(token);

      req.user = await User.findOne({ email: decoded.email }).select(
        "-password",
      );

      if (!req.user) {
        return res.json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT error:", error);
      return res.json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.json({ message: "No token, not authorized" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this route" });
    }
    next();
  };
};

module.exports = { protect, authorize };
