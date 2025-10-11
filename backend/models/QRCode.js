// models/QRCode.js
const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    longUrl: { type: String, required: true },
    qrCodeUrl: { type: String, required: true }, // Base64 image
    scans: { type: Number, default: 0 }, // keep total
    scanHistory: [
      {
        timestamp: { type: Date, default: Date.now },
      },
    ], // NEW: log every scan
  },
  { timestamps: true }
);

module.exports = mongoose.model("QRCode", qrCodeSchema);
