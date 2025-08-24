const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// Import routes
const urlRoutes = require("./routes/url");
const qrRoutes = require("./routes/qr");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// DB connection
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",   // for local dev
    "https://devalyze.vercel.app" // production frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/", urlRoutes);
app.use("/qr", qrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
