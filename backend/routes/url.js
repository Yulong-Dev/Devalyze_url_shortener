const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

// POST: Shorten URL
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(7);

  try {
    let url = new Url({ longUrl, shortCode });
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

// GET: Redirect short URL
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
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

