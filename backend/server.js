// backend/server.js (DEBUG VERSION - Find the Issue)
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

console.log("\n=== CHECKING CSRF IMPORTS ===");
const csrfModule = require("./middleware/csrf");
console.log("CSRF module exports:", Object.keys(csrfModule));
console.log("csrfProtection type:", typeof csrfModule.csrfProtection);
console.log("verifyToken type:", typeof csrfModule.verifyToken);
console.log("getToken type:", typeof csrfModule.getToken);
console.log("===========================\n");

// Import routes
const urlRoutes = require("./routes/url");
const qrRoutes = require("./routes/qr");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const pageRoutes = require("./routes/pages");
const googleAuthRouter = require("./config/GoogleAuth");

// ✅ Import CSRF middleware
const { csrfProtection, verifyToken, getToken } = require("./middleware/csrf");

// ✅ Import rate limiters
const {
  generalLimiter,
  authLimiter,
  urlShortenLimiter,
  qrGenerationLimiter,
} = require("./middleware/rateLimiter");

// ✅ Import security middleware
const { applySecurity } = require("./config/security");

// DB connection
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser - Larger JSON & form uploads (up to 10 MB)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Cookie parser (MUST be before CSRF middleware)
app.use(cookieParser());
console.log("✅ Cookie parser initialized");

// ✅ CORS Configuration - supports local + production frontends
const allowedOrigins = [
  "https://devalyze.vercel.app", // Production
  "http://localhost:5173",       // Vite Dev
  "http://localhost:5174",       // Alternate Vite
  "http://localhost:3000"        // CRA Dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS check - Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
console.log("✅ CORS initialized");

app.use(express.json());

// ✅ Apply security middleware (helmet, sanitization, etc.)
applySecurity(app, allowedOrigins);
console.log("✅ Security middleware initialized");

// ✅ Apply general rate limiter to all /api routes
app.use("/api/", generalLimiter);
console.log("✅ Rate limiter initialized");

// ✅ Logging middleware for CSRF endpoint
app.use('/api/csrf-token', (req, res, next) => {
  console.log("\n🔍 === CSRF TOKEN REQUEST RECEIVED ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Origin:", req.headers.origin);
  console.log("Cookies received:", req.cookies);
  console.log("=====================================\n");
  next();
});

// ✅ CSRF token endpoint - DETAILED VERSION FOR DEBUGGING
// backend/server.js
// REPLACE ONLY THE CSRF TOKEN ENDPOINT (around lines 91-143)

// ✅ CSRF token endpoint - FIXED VERSION
app.get("/api/csrf-token", (req, res) => {
  console.log("\n🔍 === CSRF TOKEN REQUEST ===");
  console.log("Method:", req.method);
  console.log("Origin:", req.headers.origin);
  console.log("Existing cookies:", Object.keys(req.cookies));
  
  try {
    let token = req.cookies.csrfToken;
    
    if (!token) {
      console.log("📝 Generating new CSRF token...");
      const crypto = require('crypto');
      token = crypto.randomBytes(32).toString('hex');
      console.log("✅ Token generated:", token.substring(0, 16) + "...");
    } else {
      console.log("♻️ Using existing token:", token.substring(0, 16) + "...");
    }
    
    // Set cookie
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: false, // Must be false so frontend can read it
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 3600000, // 1 hour
      path: '/',
    };
    
    res.cookie('csrfToken', token, cookieOptions);
    console.log("🍪 Cookie set with options:", cookieOptions);
    
    // Send response with proper headers
    res.status(200).json({
      success: true,
      csrfToken: token,
      message: "CSRF token generated successfully",
    });
    
    console.log("✅ Response sent successfully\n");
    
  } catch (error) {
    console.error("\n❌ ERROR IN CSRF ENDPOINT:");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("================================\n");
    
    res.status(500).json({
      success: false,
      error: "Failed to generate CSRF token",
      message: error.message,
    });
  }
});
// Health check endpoint (unprotected, no rate limit, no CSRF)
app.get("/health", (req, res) => {
  console.log("🏥 Health check endpoint hit");
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    csrf: "enabled",
    rateLimit: "enabled",
    security: "enabled",
  });
});

// ✅ NOW apply CSRF verification to all OTHER state-changing requests
// This comes AFTER the token endpoint and health check
console.log("⚠️ Applying CSRF verification middleware to all routes below this point");
app.use(verifyToken);

// ✅ Apply specific rate limiters to routes
// Auth routes (with strict rate limiting)
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth", authLimiter, googleAuthRouter);

// URL routes with rate limiting on shortening
app.use("/", urlRoutes);

// QR routes with rate limiting
app.use("/api/qr", qrGenerationLimiter, qrRoutes);

// Other routes (already have rate limiting in their own files)
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pages", pageRoutes);

// ✅ Error handling middleware - DETAILED VERSION
app.use((err, req, res, next) => {
  console.error("\n❌ === ERROR HANDLER TRIGGERED ===");
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);
  console.error("Error code:", err.code);
  console.error("Error stack:", err.stack);
  console.error("Request path:", req.path);
  console.error("Request method:", req.method);
  console.error("=================================\n");

  // Handle CSRF errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      error: "Invalid CSRF token",
      message: "CSRF token validation failed",
    });
  }

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      error: "CORS policy violation",
      message: "Origin not allowed",
    });
  }

  // Handle rate limit errors
  if (err.name === "RateLimitError") {
    return res.status(429).json({
      success: false,
      error: "Too many requests",
      message: "Please slow down and try again later",
    });
  }

  // Generic error handler - SHOW DETAILS IN DEVELOPMENT
  res.status(err.status || 500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("\n🚀 ================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 CSRF protection: ENABLED`);
  console.log(`🚦 Rate limiting: ENABLED`);
  console.log(`🛡️  Security headers: ENABLED`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ Allowed origins:`, allowedOrigins.join(", "));
  console.log("🚀 ================================\n");
});