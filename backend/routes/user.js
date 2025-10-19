const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming a Mongoose User model
const authMiddleware = require("../middleware/authMiddleware");
const { validate, profileUpdateSchema, passwordChangeSchema } = require("../middleware/validation");
const bcrypt = require("bcryptjs");

// --- Private Routes (Requires authMiddleware) ---

// GET: Fetch the currently logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password hash
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("GET /user/profile error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST: Update the currently logged-in user's profile details
router.post("/profile", authMiddleware, validate(profileUpdateSchema), async (req, res) => {
  try {
    const userId = req.user.userId;
    // req.body is the validated, sanitized data from profileUpdateSchema
    const updates = req.body; 

    // Find and update the user, preventing update of sensitive fields like email or password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" } // Return updated user, exclude password
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (err) {
    console.error("POST /user/profile update error:", err);
    res.status(500).json({ success: false, error: "Server error during profile update" });
  }
});

// POST: Change the user's password
router.post("/change-password", authMiddleware, validate(passwordChangeSchema), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      // Should not happen if auth middleware passed, but good practice
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // 1. Verify current password
    // Assuming User model has a method/plugin to compare passwords
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Incorrect current password." });
    }

    // 2. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update the password
    user.password = hashedPassword;
    await user.save(); // Mongoose pre-save hooks (if any) will run here

    res.json({ success: true, message: "Password updated successfully." });

  } catch (err) {
    console.error("POST /user/change-password error:", err);
    res.status(500).json({ success: false, error: "Server error during password change" });
  }
});

module.exports = router;
