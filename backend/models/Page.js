const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // <-- Use this instead of schema.index({ user: 1 })
    },
    username: {
      type: String,
      required: true,
      unique: true, // <-- Unique already creates an index automatically
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_-]+$/,
    },
    profileName: {
      type: String,
      default: "",
      maxlength: 100,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    profileImage: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "lakeWhite",
      enum: ["custom", "lakeWhite", "lakeBlack", "airSmoke", "airSnow", "airGrey"],
    },
    links: [
      {
        LinkTitle: {
          type: String,
          required: true,
          maxlength: 100,
        },
        LinkUrl: {
          type: String,
          required: true,
        },
        socialIcon: {
          type: String,
          default: "",
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    viewHistory: [
      {
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Remove duplicate index calls
// (unique + index fields above already handle indexing automatically)

module.exports = mongoose.model("Page", pageSchema);
