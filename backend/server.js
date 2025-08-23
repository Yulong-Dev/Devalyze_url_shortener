const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Loads variables from .env
const { nanoid } = require("nanoid");
const Url = require("./models/Url");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://devalyze.vercel.app", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// Parse JSON bodies
app.use(express.json());

// Your URL shortener routes and logic here...
const urlRoutes = require("./routes/url");
app.use("/", urlRoutes);

// QR Code generation routes
const qrRoutes = require("./routes/qr");
app.use("/qr", qrRoutes);

// Authentication routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

//user
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

// Connect to MongoDB Atlas
connectDB();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
