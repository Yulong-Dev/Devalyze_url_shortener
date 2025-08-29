const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clicks: { type: Number, default: 0 }, // 👈 NEW
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Url", UrlSchema);
