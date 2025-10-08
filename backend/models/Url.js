// models/Url.js
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clicks: { type: Number, default: 0 }, // still keep total clicks
    clickHistory: [
      {
        timestamp: { type: Date, default: Date.now },
      },
    ], // NEW: log every click
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);

