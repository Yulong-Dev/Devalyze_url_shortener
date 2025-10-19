const express = require("express");
const router = express.Router();
const Page = require("../models/Page");
const authMiddleware = require("../middleware/authMiddleware");
const { validate, pageSchema, usernameCheckSchema } = require("../middleware/validation");

/**
 * @route   POST /api/pages
 * @desc    Create or update a user's page
 * @access  Private
 */
router.post("/", authMiddleware, validate(pageSchema), async (req, res) => {
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
router.get("/check-username/:username", validate(usernameCheckSchema), async (req, res) => {
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
router.get("/:username", validate(usernameCheckSchema), async (req, res) => {
  try {
    const { username } = req.params;
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