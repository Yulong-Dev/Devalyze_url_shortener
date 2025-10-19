// backend/config/security.js

/**
 * Centralized Security Configuration
 * Includes Helmet.js, input sanitization, and security headers
 */

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

/**
 * Configure Helmet.js for security headers
 */
const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
    },
  },
  
  // DNS Prefetch Control
  dnsPrefetchControl: {
    allow: false
  },
  
  // Frameguard (prevents clickjacking)
  frameguard: {
    action: 'deny'
  },
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // Don't Sniff Mimetype
  noSniff: true,
  
  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  
  // XSS Filter
  xssFilter: true
});

/**
 * Sanitize MongoDB queries
 * Prevents NoSQL injection attacks
 */
const sanitizeConfig = mongoSanitize({
  replaceWith: '_', // Replace prohibited characters with underscore
  onSanitize: ({ req, key }) => {
    console.warn(`🚨 Sanitized field "${key}" in ${req.method} ${req.path}`);
  }
});

/**
 * Prevent XSS attacks
 * Cleans user input from malicious scripts
 */
const xssConfig = xss();

/**
 * HTTP Parameter Pollution protection
 * Prevents duplicate parameters in query strings
 */
const hppConfig = hpp({
  whitelist: [
    // Allow these parameters to be duplicated
    'sort',
    'filter',
    'fields'
  ]
});

/**
 * Additional security headers
 */
const additionalHeaders = (req, res, next) => {
  // Permissions Policy (formerly Feature Policy)
  res.setHeader('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection (legacy but still useful)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};

/**
 * Request logging middleware for security monitoring
 */
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');
  
  // Log suspicious patterns
  const suspiciousPatterns = [
    /script>/i,
    /<iframe/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
    /../i, // Directory traversal
    /\.\./i,
    /union.*select/i, // SQL injection
    /exec\(/i,
    /eval\(/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(JSON.stringify(req.body)) || 
    pattern.test(JSON.stringify(req.query)) ||
    pattern.test(req.path)
  );
  
  if (isSuspicious) {
    console.warn(`🚨 SUSPICIOUS REQUEST DETECTED:`, {
      timestamp,
      method,
      path,
      ip,
      userAgent,
      body: req.body,
      query: req.query
    });
  }
  
  next();
};

/**
 * Validate request origin
 */
const validateOrigin = (allowedOrigins) => {
  return (req, res, next) => {
    const origin = req.get('origin');
    
    // If no origin header, it's likely same-origin or server-to-server
    if (!origin) {
      return next();
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return next();
    }
    
    // Log unauthorized origin attempt
    console.warn(`⚠️ Unauthorized origin attempt:`, {
      origin,
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Origin not allowed'
    });
  };
};

/**
 * Apply all security middleware
 */
const applySecurity = (app, allowedOrigins = []) => {
  // Helmet security headers
  app.use(helmetConfig);
  
  // MongoDB query sanitization
  app.use(sanitizeConfig);
  
  // XSS protection
  app.use(xssConfig);
  
  // HTTP Parameter Pollution protection
  app.use(hppConfig);
  
  // Additional custom headers
  app.use(additionalHeaders);
  
  // Security logging
  app.use(securityLogger);
  
  // Origin validation (optional, CORS already handles this)
  // app.use(validateOrigin(allowedOrigins));
  
  console.log('✅ Security middleware initialized');
};

module.exports = {
  helmetConfig,
  sanitizeConfig,
  xssConfig,
  hppConfig,
  additionalHeaders,
  securityLogger,
  validateOrigin,
  applySecurity
};