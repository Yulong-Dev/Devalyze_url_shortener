const express = require("express");
const QRCode = require("qrcode");
const QRCodeModel = require("../models/QRCode"); // <-- your QRCode schema
const authMiddleware = require("../middleware/authMiddleware"); // <-- protects routes, gets user from token

const router = express.Router();

/**
 * @route   POST /api/qr
 * @desc    Create a new QR code (save in DB)
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Generate QR as Base64 DataURL
    const qrCodeDataURL = await QRCode.toDataURL(longUrl);

    // Save to MongoDB
    const newQR = new QRCodeModel({
      user: req.user.userId, // ✅ FIXED
      longUrl,
      qrCodeUrl: qrCodeDataURL,
      scans: 0,
    });

    await newQR.save();

    res.json(newQR);
  } catch (error) {
    console.error("QR Code generation failed:", error);
    res.status(500).json({ error: "Failed to generate QR Code" });
  }
});

/**
 * @route   GET /api/qr
 * @desc    Get all QR codes of logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const qrs = await QRCodeModel.find({ user: req.user.userId }) // ✅ FIXED
      .sort({ createdAt: -1 });

    res.json(qrs);
  } catch (error) {
    console.error("Fetching user QR codes failed:", error);
    res.status(500).json({ error: "Failed to fetch QR Codes" });
  }
});

/**
 * @route   DELETE /api/qr/:id
 * @desc    Delete a QR code by ID
 * @access  Private
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const qr = await QRCodeModel.findOne({
      _id: req.params.id,
      user: req.user.userId, // ✅ FIXED
    });

    if (!qr) {
      return res.status(404).json({ error: "QR Code not found" });
    }

    await qr.deleteOne();
    res.json({ message: "QR Code deleted successfully" });
  } catch (error) {
    console.error("Delete QR Code failed:", error);
    res.status(500).json({ error: "Failed to delete QR Code" });
  }
});

/**
 * @route   PATCH /api/qr/:id/scan
 * @desc    Increment scan count (optional analytics)
 * @access  Public
 */
router.patch("/:id/scan", async (req, res) => {
  try {
    const qr = await QRCodeModel.findById(req.params.id);

    if (!qr) {
      return res.status(404).json({ error: "QR Code not found" });
    }

    qr.scans += 1;
    await qr.save();

    res.json({ scans: qr.scans });
  } catch (error) {
    console.error("Scan counter update failed:", error);
    res.status(500).json({ error: "Failed to update scan count" });
  }
});

module.exports = router;
