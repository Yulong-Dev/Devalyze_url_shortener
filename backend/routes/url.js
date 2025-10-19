const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const authMiddleware = require("../middleware/authMiddleware");
// Import validation utilities and the new schema
const { validate, urlListSchema, shortenUrlSchema } = require("../middleware/validation");

// POST: Shorten URL (only if logged in) - Applying body validation
router.post("/shorten", authMiddleware, validate(shortenUrlSchema), async (req, res) => {
  // req.body is now the validated body
  const { longUrl, customAlias } = req.body; 
  const shortCode = customAlias || nanoid(7);

  try {
    // Check if custom alias is already in use
    if (customAlias) {
      const existingUrl = await Url.findOne({ shortCode: customAlias });
      if (existingUrl) {
        return res.status(409).json({ error: "Custom alias already taken" });
      }
    }

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

// ✅ NEW ROUTE: Get all URLs belonging to the logged-in user with sorting/searching
router.get("/my-urls", authMiddleware, validate(urlListSchema), async (req, res) => {
  try {
    // 🚨 FIX: Access validated query parameters from req.validatedQuery
    // Defaults (limit: 25, sort: 'createdAt', order: 'desc') are applied by Joi if not provided
    const { limit, sort, order, search } = req.validatedQuery; 

    const findQuery = { user: req.user.userId };
    
    // Add search filtering for longUrl (case-insensitive)
    if (search) {
      findQuery.longUrl = { $regex: search, $options: 'i' };
    }

    // Determine sort order: -1 for 'desc', 1 for 'asc'
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortQuery = { [sort]: sortOrder };

    const urls = await Url.find(findQuery)
      .limit(limit)
      .sort(sortQuery);

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
