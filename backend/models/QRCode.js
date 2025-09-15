const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User model
    required: true,
  },
  longUrl: {
    type: String, // the original URL
    required: true,
  },
  qrCodeUrl: {
    type: String, // base64 string of the generated QR code image
    required: true,
  },
  scans: {
    type: Number,
    default: 0, // how many times this QR code was scanned
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QRCode", qrCodeSchema);
