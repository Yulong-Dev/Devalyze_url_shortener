const express = require("express");
const router = express.Router();
const Page = require("../models/Page");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   POST /api/pages
 * @desc    Create or update user's page
 * @access  Private (must be logged in)
 */
router.post("/", authMiddleware, async (req, res) => {
  const { username, profileName, bio, profileImage, theme, links } = req.body;

  try {
    // Validate username format
    if (!username || username.length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
      });
    }

    // Check if username format is valid
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: "Username can only contain lowercase letters, numbers, underscores, and hyphens",
      });
    }

    // Check if username is taken by ANOTHER user
    const existingPage = await Page.findOne({ username: username.toLowerCase() });
    if (existingPage && existingPage.user.toString() !== req.user.userId) {
      return res.status(409).json({
        error: "Username already taken",
        suggestion: `${username}_${Math.floor(Math.random() * 1000)}`,
      });
    }

    // Find or create page for this user
    let page = await Page.findOne({ user: req.user.userId });

    if (page) {
      // Update existing page
      page.username = username.toLowerCase();
      page.profileName = profileName || "";
      page.bio = bio || "";
      page.profileImage = profileImage || "";
      page.theme = theme || "lakeWhite";
      page.links = links || [];
      page.isPublished = true;

      await page.save();

      console.log(`✅ Page updated for user ${req.user.userId}`);
      res.json({
        message: "Page updated successfully",
        page,
        url: `/@${page.username}`,
      });
    } else {
      // Create new page
      page = new Page({
        user: req.user.userId,
        username: username.toLowerCase(),
        profileName: profileName || "",
        bio: bio || "",
        profileImage: profileImage || "",
        theme: theme || "lakeWhite",
        links: links || [],
        isPublished: true,
      });

      await page.save();

      console.log(`✅ Page created for user ${req.user.userId}`);
      res.status(201).json({
        message: "Page created successfully",
        page,
        url: `/@${page.username}`,
      });
    }
  } catch (err) {
    console.error("Page save error:", err);
    res.status(500).json({
      error: "Failed to save page",
      message: err.message,
    });
  }
});

/**
 * @route   GET /api/pages/my-page
 * @desc    Get logged-in user's page
 * @access  Private
 */
router.get("/my-page", authMiddleware, async (req, res) => {
  try {
    const page = await Page.findOne({ user: req.user.userId });

    if (!page) {
      return res.json({
        message: "No page found. Create one to get started!",
        page: null,
      });
    }

    res.json(page);
  } catch (err) {
    console.error("Fetch my page error:", err);
    res.status(500).json({
      error: "Failed to fetch page",
      message: err.message,
    });
  }
});

/**
 * @route   GET /api/pages/check-username/:username
 * @desc    Check if username is available
 * @access  Private
 */
router.get("/check-username/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    // Check format
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return res.json({
        available: false,
        reason: "Invalid format (use lowercase letters, numbers, _ or - only)",
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.json({
        available: false,
        reason: "Username must be 3-30 characters",
      });
    }

    const page = await Page.findOne({ username: username.toLowerCase() });

    // Username is available if:
    // 1. No page exists with that username, OR
    // 2. The page belongs to the current user (they can keep their own username)
    const available = !page || page.user.toString() === req.user.userId;

    res.json({
      available,
      username: username.toLowerCase(),
      reason: available ? null : "Username already taken",
    });
  } catch (err) {
    console.error("Check username error:", err);
    res.status(500).json({
      error: "Failed to check username",
      message: err.message,
    });
  }
});

/**
 * @route   GET /api/pages/@:username
 * @desc    Get public page by username (anyone can access)
 * @access  Public
 */
router.get("/u/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find page and increment view count
    const page = await Page.findOneAndUpdate(
      {
        username: username.toLowerCase(),
        isPublished: true,
      },
      {
        $inc: { views: 1 },
        $push: { viewHistory: { timestamp: new Date() } },
      },
      { new: true }
    ).select("-user -viewHistory"); // Don't send user ID or view history to public

    if (!page) {
      return res.status(404).json({
        error: "Page not found",
        message: `No page found with username ${username}`,
      });
    }

    console.log(`👀 Page view: @${username} (Total views: ${page.views})`);

    res.json(page);
  } catch (err) {
    console.error("Fetch public page error:", err);
    res.status(500).json({
      error: "Failed to fetch page",
      message: err.message,
    });
  }
});

/**
 * @route   DELETE /api/pages/my-page
 * @desc    Delete logged-in user's page
 * @access  Private
 */
router.delete("/my-page", authMiddleware, async (req, res) => {
  try {
    const page = await Page.findOneAndDelete({ user: req.user.userId });

    if (!page) {
      return res.status(404).json({ error: "No page found to delete" });
    }

    console.log(`🗑️ Page deleted for user ${req.user.userId}`);

    res.json({
      message: "Page deleted successfully",
      username: page.username,
    });
  } catch (err) {
    console.error("Delete page error:", err);
    res.status(500).json({
      error: "Failed to delete page",
      message: err.message,
    });
  }
});

/**
 * @route   GET /api/pages/stats
 * @desc    Get page statistics for logged-in user
 * @access  Private
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const page = await Page.findOne({ user: req.user.userId });

    if (!page) {
      return res.json({
        exists: false,
        stats: null,
      });
    }

    // Calculate stats - ✅ NOW INCLUDING ALL NECESSARY FIELDS
    const stats = {
      totalViews: page.views,
      totalLinks: page.links.length,
      username: page.username,
      profileName: page.profileName,       // ✅ ADDED
      bio: page.bio,                        // ✅ ADDED
      profileImage: page.profileImage,      // ✅ ADDED
      theme: page.theme,                    // ✅ ADDED (bonus)
      url: `/@${page.username}`,
      isPublished: page.isPublished,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };

    res.json({
      exists: true,
      stats,
    });
  } catch (err) {
    console.error("Fetch stats error:", err);
    res.status(500).json({
      error: "Failed to fetch stats",
      message: err.message,
    });
  }
});

module.exports = router;