const crypto = require("crypto");

function csrfMiddleware(req, res, next) {
  try {
    // 🔍 DEBUG: Check if cookies are being parsed
    console.log("🔍 req.cookies:", req.cookies);
    console.log("🔍 cookieParser loaded:", typeof req.cookies);
    console.log("🔍 Request path:", req.path);
    console.log("🔍 Request method:", req.method);
    
    // ⚠️ Handle case where req.cookies is undefined
    if (!req.cookies) {
      console.warn("⚠️ req.cookies is undefined - cookieParser may not be running");
      req.cookies = {}; // Initialize empty object to prevent errors
    }
    
    // Check if token already exists in cookies
    let csrfToken = req.cookies._csrf;

    if (!csrfToken) {
      csrfToken = crypto.randomBytes(32).toString("hex");
      res.cookie("_csrf", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });
      console.log("🆕 CSRF token created and set in cookie");
    } else {
      console.log("✅ Existing CSRF token found");
    }

    // Attach a function to req for generating the token
    req.csrfToken = () => csrfToken;

    next();
  } catch (err) {
    console.error("❌ CSRF Middleware error:", err);
    console.error("📍 Stack:", err.stack);
    next(err);
  }
}

function validateCsrf(req, res, next) {
  // ✅ Skip CSRF validation for safe HTTP methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    console.log("✅ Skipping CSRF validation for safe method:", req.method);
    return next();
  }

  console.log("🔍 validateCsrf - req.cookies:", req.cookies);
  console.log("🔍 validateCsrf - req.csrfToken:", typeof req.csrfToken);
  console.log("🔍 validateCsrf - req.body:", req.body);
  
  // ✅ FIX: Safely access req.body._csrf even if req.body is undefined
  const tokenFromClient = req.get("X-CSRF-Token") || (req.body && req.body._csrf);

  if (!tokenFromClient || tokenFromClient !== req.csrfToken()) {
    const err = new Error("CSRF token validation failed");
    err.code = "EBADCSRFTOKEN";
    return next(err);
  }

  console.log("✅ CSRF token validated successfully");
  next();
}

module.exports = {
  csrfMiddleware,
  validateCsrf,
};