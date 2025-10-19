const express = require("express");
const router = express.Router();
const Page = require("../models/Page");
const authMiddleware = require("../middleware/authMiddleware");
const { pageSchema, usernameCheckSchema } = require("../middleware/validation");

/**
 * Safer per-route validation middleware to prevent req.query mutation
 */
const safeValidate = (schema) => {
  return (req, res, next) => {
    try {
      // Clone objects before validation (avoid Express 5 readonly getters)
      const validationTarget = {
        body: { ...req.body },
        query: { ...req.query },
        params: { ...req.params },
      };

      const { error, value } = schema.validate(validationTarget, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));

        console.warn(`⚠️ Validation failed for ${req.method} ${req.path}:`, errors);

        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: errors,
        });
      }

      // Safely replace validated data
      if (value.body) req.body = value.body;
      if (value.params) req.params = value.params;
      req.validatedQuery = value.query || {};

      next();
    } catch (err) {
      console.error("❌ Validation middleware error:", err);
      res.status(500).json({
        success: false,
        error: "Internal validation middleware error",
      });
    }
  };
};

/**
 * @route   POST /api/pages
 * @desc    Create or update a user's page
 * @access  Private
 */
router.post("/", authMiddleware, safeValidate(pageSchema), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, profileName, bio, profileImage, theme, links } = req.body;

    // Check if username already exists for another user
    const existingPage = await Page.findOne({ username });
    if (existingPage && existingPage.user.toString() !== userId) {
      return res.status(409).json({ success: false, error: "Username is already taken." });
    }

    const pageData = { user: userId, username, profileName, bio, profileImage, theme, links };

    const updatedPage = await Page.findOneAndUpdate(
      { user: userId },
      { $set: pageData },
      { new: true, upsert: true, runValidators: true }
    );

    const { _id, user, ...responsePage } = updatedPage.toObject();

    res.json({
      success: true,
      message: "Page saved successfully",
      page: responsePage,
    });
  } catch (err) {
    console.error("POST /pages error:", err);
    res.status(500).json({ success: false, error: "Server error during page save" });
  }
});

/**
 * @route   GET /api/pages/my-page
 * @desc    Fetch the logged-in user's page data
 * @access  Private
 */
router.get("/my-page", authMiddleware, async (req, res) => {
  try {
    const page = await Page.findOne({ user: req.user.userId });

    if (!page) {
      return res.json({
        success: true,
        page: {
          username: req.user.username || "",
          profileName: "",
          bio: "",
          profileImage: "",
          theme: "lakeWhite",
          links: [],
        },
        message: "No page found, returning default structure.",
      });
    }

    const { _id, user, ...responsePage } = page.toObject();
    res.json({ success: true, page: responsePage });
  } catch (err) {
    console.error("GET /pages/my-page error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * @route   GET /api/pages/check-username/:username
 * @desc    Check if a username is available
 * @access  Public
 */
router.get("/check-username/:username", safeValidate(usernameCheckSchema), async (req, res) => {
  try {
    const { username } = req.params;

    const existingPage = await Page.findOne({ username });
    if (existingPage) {
      return res.json({
        success: true,
        available: false,
        message: "Username is already taken.",
      });
    }

    res.json({ success: true, available: true, message: "Username is available!" });
  } catch (err) {
    console.error("GET /pages/check-username error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * @route   GET /api/pages/:username
 * @desc    Public view of a user's page
 * @access  Public
 */
router.get("/:username", safeValidate(usernameCheckSchema), async (req, res) => {
  try {
    const { username } = req.params; // ✅ fixed (was req.validatedQuery before)
    const page = await Page.findOne({ username });

    if (!page) {
      return res.status(404).json({ success: false, error: "User page not found." });
    }

    const { _id, user, ...responsePage } = page.toObject();
    res.json({ success: true, page: responsePage });
  } catch (err) {
    console.error("GET /:username error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
