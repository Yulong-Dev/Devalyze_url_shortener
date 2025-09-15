// routes/user.js
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

// @route   GET /api/users/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PATCH /api/users/me
// @desc    Update user profile (name, email, language, country, surname, otherNames)
// @access  Private
router.patch("/me", verifyToken, async (req, res) => {
  const { fullName, surname, otherNames, email, language, country } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, surname, otherNames, email, language, country },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});


// @route   PATCH /api/users/me/password
// @desc    Change password
// @access  Private
router.patch("/me/password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update password", error: err.message });
  }
});

module.exports = router;

