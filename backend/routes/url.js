const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const authMiddleware = require("../middleware/authMiddleware");

// POST: Shorten URL (only if logged in)
router.post("/shorten", authMiddleware, async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(7);

  try {
    let url = new Url({
      longUrl,
      shortCode,
      user: req.user.userId, // Link to logged-in user
    });

    await url.save();

    const protocol = req.protocol;
    const host = req.headers.host;
    const fullShortUrl = `${protocol}://${host}/${shortCode}`;

    res.json({ shortUrl: fullShortUrl });
  } catch (err) {
    console.error("POST /shorten error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ NEW ROUTE: Get all URLs belonging to the logged-in user
router.get("/my-urls", authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(urls);
  } catch (err) {
    console.error("GET /my-urls error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedUrl = await Url.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!deletedUrl) {
      return res.status(404).json({ error: "URL not found or not authorized" });
    }
    res.json({ message: "URL deleted successfully", url: deletedUrl });
  } catch (err) {
    console.error("DELETE /:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Redirect short URL
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOneAndUpdate(
      { shortCode },
      {
        $inc: { clicks: 1 },
        $push: { clickHistory: { timestamp: new Date() } }, // log click
      },
      { new: true }
    );

    if (url) {
      res.redirect(url.longUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    console.error("GET /:shortCode error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
