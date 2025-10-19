// backend/middleware/rateLimiter.js

/**
 * Rate Limiting Middleware
 * Protects against brute force and DoS attacks
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Applies to all API routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests, please slow down.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000
    });
  }
});

/**
 * Strict limiter for authentication endpoints
 * Prevents brute force attacks on login/signup
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP per window
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: false, // Count all requests
  handler: (req, res) => {
    console.warn(`🚨 Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please wait 15 minutes before trying again.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000
    });
  }
});

/**
 * Password reset rate limiter
 * Prevents abuse of password reset functionality
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    error: 'Too many password reset attempts.',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    console.warn(`🚨 Password reset rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many password reset requests. Please try again in 1 hour.',
    });
  }
});

/**
 * URL shortening rate limiter
 * Prevents spam and abuse of URL shortening service
 */
const urlShortenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 URLs per hour per IP
  message: {
    success: false,
    error: 'URL shortening limit reached.',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    console.warn(`⚠️ URL shorten limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'You have reached the hourly limit for URL shortening. Please try again later.',
    });
  }
});

/**
 * QR code generation rate limiter
 * Prevents abuse of QR code generation service
 */
const qrGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 QR codes per hour per IP
  message: {
    success: false,
    error: 'QR code generation limit reached.',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    console.warn(`⚠️ QR generation limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'You have reached the hourly limit for QR code generation. Please try again later.',
    });
  }
});

/**
 * Profile update rate limiter
 * Already exists in user.js, kept here for reference
 */
const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 updates per 15 minutes
  message: 'Too many profile update attempts',
});

/**
 * Password change rate limiter
 * Already exists in user.js, kept here for reference
 */
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 password changes per 15 minutes
  message: 'Too many password change attempts. Please try again later.',
});

/**
 * Email verification rate limiter
 * Prevents spam of verification emails
 */
const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 verification emails per hour
  message: {
    success: false,
    error: 'Too many verification emails requested.',
    retryAfter: '1 hour'
  },
});

/**
 * API key for bypassing rate limits (for testing/admin)
 * Check for special header to skip rate limiting
 */
const skipRateLimitCheck = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.ADMIN_API_KEY;
  
  if (apiKey && validApiKey && apiKey === validApiKey) {
    console.log('✅ Rate limit bypassed with valid API key');
    return next();
  }
  
  // Continue to rate limiter
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  urlShortenLimiter,
  qrGenerationLimiter,
  profileUpdateLimiter,
  passwordChangeLimiter,
  emailVerificationLimiter,
  skipRateLimitCheck
};