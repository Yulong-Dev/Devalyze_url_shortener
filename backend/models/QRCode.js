// models/QRCode.js
const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    longUrl: { type: String, required: true },
    qrCodeUrl: { type: String, required: true }, // Data URI with Base64-encoded PNG image (e.g., "data:image/png;base64,...")
    scans: { type: Number, default: 0 }, // keep total
    scanHistory: [
      {
        timestamp: { type: Date, default: Date.now },
      },
    ], // scanHistory: an array of objects, each containing a timestamp to log every scan event for this QR code
  },
  { timestamps: true }
);

module.exports = mongoose.model("QRCode", qrCodeSchema);
