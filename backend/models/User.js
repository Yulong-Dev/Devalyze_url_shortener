const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    otherNames: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    language: { 
      type: String, 
      default: "" 
    }, // new
    country: { 
      type: String, 
      default: "" 
    }, // new
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
