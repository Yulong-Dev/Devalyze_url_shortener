// backend/middleware/validation.js

/**
 * Input Validation Middleware using Joi
 * Validates request body, query, and params
 */

const Joi = require('joi');

/**
 * Generic validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationTarget = {
      body: req.body,
      query: req.query,
      params: req.params
    };
    
    const { error, value } = schema.validate(validationTarget, {
      abortEarly: false, // Return all errors, not just the first
      stripUnknown: true // Remove unknown fields
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      console.warn(`⚠️ Validation failed for ${req.method} ${req.path}:`, errors);
      
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors
      });
    }
    
    // Replace request with validated and sanitized values
    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;
    
    next();
  };
};

/**
 * Common validation schemas
 */

// User registration validation
const registerSchema = Joi.object({
  body: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.min': 'Full name must be at least 2 characters',
        'string.max': 'Full name cannot exceed 100 characters',
        'any.required': 'Full name is required'
      }),
    
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
        'any.required': 'Password is required'
      })
  })
});

// User login validation
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
});

// URL shortening validation
const shortenUrlSchema = Joi.object({
  body: Joi.object({
    longUrl: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .max(2048)
      .required()
      .messages({
        'string.uri': 'Please provide a valid URL (must start with http:// or https://)',
        'string.max': 'URL is too long (max 2048 characters)',
        'any.required': 'URL is required'
      }),
    
    customAlias: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .optional()
      .messages({
        'string.alphanum': 'Custom alias can only contain letters and numbers',
        'string.min': 'Custom alias must be at least 3 characters',
        'string.max': 'Custom alias cannot exceed 50 characters'
      })
  })
});

// QR code generation validation
const generateQrSchema = Joi.object({
  body: Joi.object({
    longUrl: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .max(2048)
      .required()
      .messages({
        'string.uri': 'Please provide a valid URL',
        'any.required': 'URL is required'
      })
  })
});

// Page creation/update validation
const pageSchema = Joi.object({
  body: Joi.object({
    username: Joi.string()
      .lowercase()
      .trim()
      .min(3)
      .max(30)
      .pattern(/^[a-z0-9_-]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain lowercase letters, numbers, underscores, and hyphens',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    
    profileName: Joi.string()
      .max(100)
      .trim()
      .optional()
      .allow('')
      .messages({
        'string.max': 'Profile name cannot exceed 100 characters'
      }),
    
    bio: Joi.string()
      .max(500)
      .trim()
      .optional()
      .allow('')
      .messages({
        'string.max': 'Bio cannot exceed 500 characters'
      }),
    
    profileImage: Joi.string()
      .uri()
      .optional()
      .allow('')
      .messages({
        'string.uri': 'Profile image must be a valid URL'
      }),
    
    theme: Joi.string()
      .valid('custom', 'lakeWhite', 'lakeBlack', 'airSmoke', 'airSnow', 'airGrey')
      .optional()
      .messages({
        'any.only': 'Invalid theme selected'
      }),
    
    links: Joi.array()
      .items(
        Joi.object({
          LinkTitle: Joi.string()
            .max(100)
            .required()
            .messages({
              'string.max': 'Link title cannot exceed 100 characters',
              'any.required': 'Link title is required'
            }),
          
          LinkUrl: Joi.string()
            .uri()
            .required()
            .messages({
              'string.uri': 'Link URL must be valid',
              'any.required': 'Link URL is required'
            }),
          
          socialIcon: Joi.string()
            .uri()
            .optional()
            .allow(''),
          
          order: Joi.number()
            .integer()
            .optional()
        })
      )
      .optional()
  })
});

// Profile update validation
const profileUpdateSchema = Joi.object({
  body: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .optional()
      .messages({
        'string.min': 'Full name must be at least 2 characters',
        'string.max': 'Full name cannot exceed 100 characters'
      }),
    
    surname: Joi.string()
      .max(50)
      .trim()
      .optional()
      .allow(''),
    
    otherNames: Joi.string()
      .max(100)
      .trim()
      .optional()
      .allow(''),
    
    language: Joi.string()
      .max(50)
      .optional(),
    
    country: Joi.string()
      .max(100)
      .optional()
  })
});

// Password change validation
const passwordChangeSchema = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
        'any.required': 'New password is required'
      })
  })
});

// MongoDB ObjectId validation
const objectIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ID format',
        'any.required': 'ID is required'
      })
  })
});

// Username check validation
const usernameCheckSchema = Joi.object({
  params: Joi.object({
    username: Joi.string()
      .lowercase()
      .trim()
      .min(3)
      .max(30)
      .pattern(/^[a-z0-9_-]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain lowercase letters, numbers, underscores, and hyphens',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      })
  })
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  shortenUrlSchema,
  generateQrSchema,
  pageSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  objectIdSchema,
  usernameCheckSchema
};