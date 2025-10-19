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

// CORS - BEFORE CSRF
const allowedOrigins = [
  "https://devalyze.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-CSRF-Token"],
  exposedHeaders: ["Set-Cookie"]
}));

// Security headers & rate limiter
applySecurity(app, allowedOrigins);
app.use("/api", generalLimiter);

// ✅ CSRF token generation - ONLY ONCE, AFTER CORS
app.use(csrfMiddleware);

// Routes
app.use("/api/csrf", csrfRoutes);

// State-changing routes with CSRF validation
app.use("/api/auth", authLimiter, validateCsrf, authRoutes);
app.use("/api/auth", authLimiter, googleAuthRouter);
app.use("/", validateCsrf, urlRoutes);
app.use("/api/qr", qrGenerationLimiter, validateCsrf, qrRoutes);
app.use("/api/users", validateCsrf, userRoutes);
app.use("/api/pages", validateCsrf, pageRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", csrf: !!req.csrfToken });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ success: false, error: "Invalid CSRF token" });
  }
  res.status(err.status || 500).json({ success: false, error: err.message });
});

// DB + start
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));