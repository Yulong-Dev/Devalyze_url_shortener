// backend/middleware/authMiddleware.js (assuming this is the file name)
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * JWT Authentication Middleware
 * (Renamed from verifyToken to authenticateJWT for clarity)
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now available in protected routes
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateJWT;