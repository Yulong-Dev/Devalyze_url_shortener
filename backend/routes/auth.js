const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Helper function to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Extended to 7 days for better UX
  );
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isStrongPassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

// POST: Register User
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email format" 
      });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters long" 
      });
    }

    // Validate full name (at least 2 characters)
    if (fullName.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: "Full name must be at least 2 characters" 
      });
    }

    // Split name into surname and other names
    const nameParts = fullName.trim().split(" ");
    const surname = nameParts[0];
    const otherNames = nameParts.slice(1).join(" ");

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: "Email already in use" 
      });
    }

    // ✅ FIXED: Pass plain password - let the pre-save hook hash it
    const newUser = new User({
      fullName: fullName.trim(),
      surname,
      otherNames,
      email: email.toLowerCase(),
      password, // Plain password - pre-save hook will hash it
    });

    await newUser.save(); // Password gets hashed here by the pre-save hook

    // Generate JWT Token
    const token = generateToken(newUser._id, newUser.email);

    // Log successful registration
    console.log(`✅ New user registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        surname: newUser.surname,
        otherNames: newUser.otherNames,
        email: newUser.email,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle duplicate key error (race condition)
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: "Email already in use" 
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: "Validation error",
        error: err.message 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// POST: Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Check if user has a password (Google users might not)
    if (!user.password) {
      return res.status(401).json({ 
        success: false,
        message: "This account uses Google Sign-In. Please sign in with Google." 
      });
    }

    // ✅ Use the comparePassword method from the User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate JWT Token
    const token = generateToken(user._id, user.email);

    // Log successful login
    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        surname: user.surname,
        otherNames: user.otherNames,
        email: user.email,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// POST: Refresh Token (Optional - for extended sessions)
router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Token is required" 
      });
    }

    // Verify the old token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Generate new token
    const newToken = generateToken(user._id, user.email);

    res.json({
      success: true,
      token: newToken,
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

module.exports = router;