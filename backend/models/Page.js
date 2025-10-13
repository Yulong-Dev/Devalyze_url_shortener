const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can only have ONE page
    },
    username: {
      type: String,
      required: true,
      unique: true, // Usernames must be unique across all users
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_-]+$/, // Only lowercase letters, numbers, underscores, hyphens
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
      default: true, // Auto-publish on save
    },
    views: {
      type: Number,
      default: 0,
    },
    viewHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        // You can add more fields like IP, country, etc. later
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster username lookups
pageSchema.index({ username: 1 });
pageSchema.index({ user: 1 });

module.exports = mongoose.model("Page", pageSchema);