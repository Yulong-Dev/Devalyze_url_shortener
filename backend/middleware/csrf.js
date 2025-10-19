const crypto = require("crypto");

function csrfMiddleware(req, res, next) {
  try {
    // 🔍 DEBUG: Check if cookies are being parsed
    console.log("🔍 req.cookies:", req.cookies);
    console.log("🔍 cookieParser loaded:", typeof req.cookies);
    
    // Check if token already exists in cookies
    let csrfToken = req.cookies?._csrf; // Use optional chaining

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
    next(err);
  }
}

function validateCsrf(req, res, next) {
  const tokenFromClient = req.get("X-CSRF-Token") || req.body._csrf;

  if (!tokenFromClient || tokenFromClient !== req.csrfToken()) {
    const err = new Error("CSRF token validation failed");
    err.code = "EBADCSRFTOKEN";
    return next(err);
  }

  next();
}

module.exports = {
  csrfMiddleware,
  validateCsrf,
};