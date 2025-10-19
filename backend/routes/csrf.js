const express = require("express");
// No need to import csrfMiddleware here since it's global

const router = express.Router();

// Return CSRF token - middleware already applied globally
router.get("/csrf-token", (req, res) => {
  try {
    const token = req.csrfToken(); // ✅ Available from global middleware

    res.status(200).json({
      success: true,
      csrfToken: token,
      message: "CSRF token retrieved successfully",
    });
  } catch (err) {
    console.error("❌ Error in /csrf-token route:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
});

module.exports = router;