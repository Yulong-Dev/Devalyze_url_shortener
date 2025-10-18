const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

// Rate limiters
const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many profile update attempts",
});

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many password change attempts. Please try again later.",
});

// @route   GET /api/users/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -__v -passwordHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.toPublicJSON());
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PATCH /api/users/me
// @desc    Update user profile
// @access  Private
router.patch("/me", 
  verifyToken,
  profileUpdateLimiter,
  [
    body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
    body('fullName').optional().trim().isLength({ min: 2, max: 100 }),
    body('surname').optional().trim().isLength({ max: 50 }),
    body('otherNames').optional().trim().isLength({ max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, surname, otherNames, email, language, country } = req.body;

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle email change with verification
      if (email && email.toLowerCase() !== user.email.toLowerCase()) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return res.status(400).json({ message: "This operation cannot be completed" });
        }
        
        // TODO: Implement email verification flow
        return res.status(400).json({ 
          message: "Email change requires verification. Feature coming soon." 
        });
      }

      // Update allowed fields only
      const allowedUpdates = { fullName, surname, otherNames, language, country };
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key] !== undefined) {
          user[key] = allowedUpdates[key];
        }
      });

      await user.save();

      res.json(user.toPublicJSON());
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
);

// @route   PATCH /api/users/me/password
// @desc    Change password
// @access  Private
router.patch("/me/password", 
  verifyToken,
  passwordChangeLimiter,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Check if passwords are the same
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different" });
    }

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if account has password (not OAuth)
      if (!user.password) {
        return res.status(400).json({ 
          message: "Cannot change password for social login accounts" 
        });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update password (model will hash it)
      user.password = newPassword;
      user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate old tokens
      await user.save();

      // Log security event
      console.log(`[SECURITY] Password changed for user ${user._id}`);

      res.json({ 
        message: "Password updated successfully. Please log in again with your new password." 
      });
    } catch (err) {
      console.error('Password change error:', err);
      res.status(500).json({ message: "Failed to update password" });
    }
  }
);

module.exports = router;