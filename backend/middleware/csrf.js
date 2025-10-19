// backend/middleware/csrf.js
const crypto = require('crypto');

/**
 * Generate a cryptographically secure random token
 * @returns {string} 64-character hex string
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * CSRF Protection Middleware
 * Generates and sets CSRF token in cookie if not present
 * Should be applied before routes that need CSRF protection
 */
function csrfProtection(req, res, next) {
  // Check if CSRF token already exists in cookies
  if (!req.cookies.csrfToken) {
    // Generate new token
    const token = generateToken();

    // Determine sameSite and secure settings dynamically
    const isProd = process.env.NODE_ENV === 'production';

    // ✅ For localhost, use lax and insecure cookies.
    // ✅ For production, use strict + secure.
    res.cookie('csrfToken', token, {
      httpOnly: false, // must be readable by JS (frontend will read it)
      secure: isProd, // HTTPS only in production
      sameSite: isProd ? 'strict' : 'lax', // allow localhost cross-origin
      maxAge: 3600000, // 1 hour
      path: '/',
    });

    req.csrfToken = token;
    console.log('✅ New CSRF token generated:', token.substring(0, 8) + '...');
  } else {
    req.csrfToken = req.cookies.csrfToken;
    console.log('♻️  Existing CSRF token reused');
  }

  next();
}

/**
 * Verify CSRF Token Middleware
 * Validates that the CSRF token in the header matches the cookie
 * Should be applied to all state-changing routes (POST, PUT, DELETE, PATCH)
 */
function verifyToken(req, res, next) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(req.method)) {
    console.log(`✓ ${req.method} request - CSRF check skipped`);
    return next();
  }

  const tokenFromCookie = req.cookies.csrfToken;
  const tokenFromHeader = req.headers['x-csrf-token'];

  if (!tokenFromCookie || !tokenFromHeader) {
    console.error('❌ CSRF token missing:', {
      cookie: !!tokenFromCookie,
      header: !!tokenFromHeader,
      method: req.method,
      path: req.path,
    });

    return res.status(403).json({
      success: false,
      error: 'CSRF token missing',
      code: 'CSRF_TOKEN_REQUIRED',
      message: 'Request rejected for security reasons',
    });
  }

  try {
    const bufferFromCookie = Buffer.from(tokenFromCookie);
    const bufferFromHeader = Buffer.from(tokenFromHeader);

    if (bufferFromCookie.length !== bufferFromHeader.length) {
      throw new Error('Token length mismatch');
    }

    const tokensMatch = crypto.timingSafeEqual(bufferFromCookie, bufferFromHeader);

    if (!tokensMatch) {
      console.error('❌ CSRF token mismatch:', {
        method: req.method,
        path: req.path,
        cookie: tokenFromCookie.substring(0, 8) + '...',
        header: tokenFromHeader.substring(0, 8) + '...',
      });

      return res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
        code: 'CSRF_TOKEN_INVALID',
        message: 'Request rejected for security reasons',
      });
    }

    console.log(`✅ CSRF token valid for ${req.method} ${req.path}`);
    next();
  } catch (error) {
    console.error('❌ CSRF verification error:', error.message);

    return res.status(403).json({
      success: false,
      error: 'CSRF token validation failed',
      code: 'CSRF_VALIDATION_ERROR',
      message: 'Request rejected for security reasons',
    });
  }
}

/**
 * Get CSRF token from request (helper function)
 */
function getToken(req) {
  return req.csrfToken || req.cookies.csrfToken || null;
}

/**
 * Clear CSRF token (for logout, etc.)
 */
function clearToken(res) {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('csrfToken', {
    path: '/',
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
  });
}

module.exports = {
  csrfProtection,
  verifyToken,
  generateToken,
  getToken,
  clearToken,
};