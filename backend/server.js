const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// CSRF
const { csrfMiddleware, validateCsrf } = require("./middleware/csrf");
const csrfRoutes = require("./routes/csrf");

// Routes
const urlRoutes = require("./routes/url");
const qrRoutes = require("./routes/qr");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const pageRoutes = require("./routes/pages");
const googleAuthRouter = require("./config/GoogleAuth");

// Rate limiters & security
const { generalLimiter, authLimiter, qrGenerationLimiter } = require("./middleware/rateLimiter");
const { applySecurity } = require("./config/security");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORRECT ORDER
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

// CORS - UPDATED TO FIX YOUR ISSUES
const allowedOrigins = [
  "https://devalyze.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5000",  // Added this
  "http://127.0.0.1:5173",  // Added this
  "http://127.0.0.1:5174",  // Added this
  "http://127.0.0.1:3000",  // Added this
  "http://127.0.0.1:5000"   // Added this
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log the rejected origin for debugging
    console.log("❌ CORS blocked origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly (removed - CORS middleware already handles this)

// Security headers & rate limiter
applySecurity(app, allowedOrigins);
app.use("/api", generalLimiter);

// ✅ CSRF token generation - ONLY ONCE, AFTER CORS
app.use(csrfMiddleware);

// ========================================
// Routes WITHOUT CSRF validation (read-only or token generation)
// ========================================
app.use("/api", csrfRoutes); // ✅ CSRF token endpoint - NO validation needed
app.use("/api/analytics", analyticsRoutes); // ✅ Read-only analytics
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    csrf: !!req.csrfToken,
    timestamp: new Date().toISOString()
  });
});

// ========================================
// Routes WITH CSRF validation (state-changing operations)
// ========================================
app.use("/api/auth", authLimiter, validateCsrf, authRoutes);
app.use("/api/auth", authLimiter, googleAuthRouter); // Google auth - consider if this needs CSRF
app.use("/api/qr", qrGenerationLimiter, validateCsrf, qrRoutes);
app.use("/api/users", validateCsrf, userRoutes);
app.use("/api/pages", validateCsrf, pageRoutes);

// ⚠️ URL routes at the END to avoid catching /api/* routes
app.use("/", validateCsrf, urlRoutes);

// Enhanced Error Handler
app.use((err, req, res, next) => {
  // Log error details
  console.error("❌ ERROR:", err.message);
  console.error("📍 STACK:", err.stack);
  console.error("🔍 Request Path:", req.path);
  console.error("🔍 Request Method:", req.method);
  console.error("🔍 Origin:", req.headers.origin);
  
  // CSRF token validation error
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ 
      success: false, 
      error: "Invalid CSRF token" 
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.message
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry",
      details: "A record with that value already exists"
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
      details: err.message
    });
  }

  // CORS errors
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      error: "CORS policy violation",
      origin: req.headers.origin
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ 
    success: false, 
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler - Must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path
  });
});

// DB + start
connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});