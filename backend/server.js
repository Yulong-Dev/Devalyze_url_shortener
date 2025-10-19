// backend/server.js (Complete Version)
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
const urlRoutes = require("./routes/url");
const qrRoutes = require("./routes/qr");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const pageRoutes = require("./routes/pages");
const googleAuthRouter = require('./config/GoogleAuth');

// ✅ Import CSRF middleware
const { csrfProtection, verifyToken } = require("./middleware/csrf");

// ✅ Import rate limiters
const {
  generalLimiter,
  authLimiter,
  urlShortenLimiter,
  qrGenerationLimiter,
} = require("./middleware/rateLimiter");

// ✅ ADD THIS: Import security middleware
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

// CORS Configuration - Supports both production and development
const allowedOrigins = [
  'https://devalyze.vercel.app',  // Production frontend
  'http://localhost:3000',         // React dev server
  'http://localhost:5173',         // Vite dev server
  'http://localhost:5174'          // Alternative Vite port
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

app.use(express.json());

// ✅ ADD THIS: Apply security middleware (helmet, sanitization, etc.)
applySecurity(app, allowedOrigins);

// ✅ Apply general rate limiter to all /api routes
app.use('/api/', generalLimiter);

// Apply CSRF protection to all routes
app.use(csrfProtection);

// CSRF token endpoint (no rate limit needed - it's GET)
app.get('/api/csrf-token', (req, res) => {
  res.json({ 
    csrfToken: req.csrfToken,
    message: 'CSRF token generated successfully'
  });
});

// Verify CSRF token on state-changing requests
app.use(verifyToken);

// ✅ Apply specific rate limiters to routes
// Auth routes with strict rate limiting
app.use("/api/auth", authLimiter, authRoutes);
app.use('/api/auth', authLimiter, googleAuthRouter);

// URL routes with rate limiting on shortening
app.use("/", urlRoutes);

// QR routes with rate limiting
app.use("/api/qr", qrGenerationLimiter, qrRoutes);

// Other routes (already have rate limiting in their own files)
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pages", pageRoutes);

// Health check endpoint (unprotected, no rate limit)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    csrf: 'enabled',
    rateLimit: 'enabled',
    security: 'enabled'  // ✅ ADD THIS
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
  }
  
  // Handle rate limit errors (if any slip through)
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Please slow down and try again later'
    });
  }
  
  // Generic error handler
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 CSRF protection: ENABLED`);
  console.log(`🚦 Rate limiting: ENABLED`);
  console.log(`🛡️  Security headers: ENABLED`);  // ✅ ADD THIS
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Allowed origins:`, allowedOrigins.join(', '));
});