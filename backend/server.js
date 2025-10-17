const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const urlRoutes = require("./routes/url");
const qrRoutes = require("./routes/qr");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const pageRoutes = require("./routes/pages");
const googleAuthRouter = require('./config/GoogleAuth'); // or wherever your file is



// DB connection
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow larger JSON & form uploads (up to 10 MB)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Middleware
app.use(cors({
  origin: "*",
  methods: "*",
}));
app.use(express.json());

// Routes
app.use("/", urlRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pages", pageRoutes);
app.use('/api/auth', googleAuthRouter);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
