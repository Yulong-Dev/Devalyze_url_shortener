const express = require("express");
const QRCode = require("qrcode");
const QRCodeModel = require("../models/QRCode");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/qr
 * @desc    Create a new QR code (save in DB and generate redirect QR)
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Step 1: Prepare the redirect URL (before saving)
    const BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://dvilz.onrender.com" // your hosted backend
        : "http://localhost:5000"; // local dev backend

    // We'll first create a temp ID manually to use in redirect URL
    const tempQR = new QRCodeModel();
    const redirectUrl = `${BASE_URL}/api/qr/redirect/${tempQR._id}`;

    // Step 2: Generate the QR code image
    const qrCodeDataURL = await QRCode.toDataURL(redirectUrl);

    // Step 3: Now save everything (so validation passes)
    const newQR = new QRCodeModel({
      _id: tempQR._id,
      user: req.user.userId,
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
    const qrs = await QRCodeModel.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
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
      user: req.user.userId,
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
 * @route   GET /api/qr/redirect/:id
 * @desc    When someone scans the QR, increment scan count + redirect
 * @access  Public
 */
router.get("/redirect/:id", async (req, res) => {
  try {
    const qr = await QRCodeModel.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { scans: 1 },
        $push: { scanHistory: { timestamp: new Date() } },
      },
      { new: true }
    );

    if (!qr) {
      return res.status(404).json({ error: "QR Code not found" });
    }

    // Redirect the user to the actual destination
    return res.redirect(qr.longUrl);
  } catch (error) {
    console.error("Redirect + scan update failed:", error);
    res.status(500).json({ error: "Failed to redirect" });
  }
});

module.exports = router;
