// backend/config/security.js
const helmet = require('helmet');
//const mongoSanitize = require('express-mongo-sanitize');

/**
 * Apply security middleware
 */
const applySecurity = (app, allowedOrigins = []) => {
  // Basic helmet configuration
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  
  // MongoDB injection protection - FIX: Use onSanitize instead of replaceWith
  // app.use(mongoSanitize({
  //   onSanitize: ({ req, key }) => {
  //     console.warn(`⚠️ Sanitized key: ${key}`);
  //   },
  // }));
  
  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  console.log('✅ Security middleware initialized');
};

module.exports = {
  applySecurity
};