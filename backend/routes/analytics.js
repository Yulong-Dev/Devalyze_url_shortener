const express = require("express");
const mongoose = require("mongoose");
const Url = require("../models/Url");
const QRCode = require("../models/QRCode");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Get clicks + scans trend for logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing in token" });
    }

    // Convert userId safely if valid
    const userObjectId = mongoose.isValidObjectId(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // --- Group Clicks ---
    const clickData = await Url.aggregate([
      { $match: { user: userObjectId } },
      { $unwind: "$clickHistory" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickHistory.timestamp" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Group Scans ---
    const scanData = await QRCode.aggregate([
      { $match: { user: userObjectId } },
      { $unwind: "$scanHistory" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$scanHistory.timestamp" } },
          scans: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Merge Results ---
    const map = {};

    clickData.forEach((item) => {
      map[item._id] = { date: item._id, clicks: item.clicks, scans: 0 };
    });

    scanData.forEach((item) => {
      if (map[item._id]) {
        map[item._id].scans = item.scans;
      } else {
        map[item._id] = { date: item._id, clicks: 0, scans: item.scans };
      }
    });

    const result = Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(result);
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch analytics",
      message: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
