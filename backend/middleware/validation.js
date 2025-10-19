/**
 * Input Validation Middleware using Joi
 * Safe for Express 5 (req.query is read-only)
 */

const Joi = require("joi");

/**
 * Generic validation middleware
 * Clones Express request objects so we never mutate getters
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Clone request properties to avoid touching Express getters
      const validationTarget = {
        body: { ...req.body },
        query: { ...req.query },
        params: { ...req.params },
      };

      const { error, value } = schema.validate(validationTarget, {
        abortEarly: false, // collect all errors
        stripUnknown: true, // remove unknown keys
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));

        console.warn(`⚠️ Validation failed for ${req.method} ${req.path}:`, errors);

        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: errors,
        });
      }

      // ✅ Safely assign sanitized data
      if (value.body) req.body = value.body;
      if (value.params) req.params = value.params;
      req.validatedQuery = value.query || {};

      next();
    } catch (err) {
      console.error("❌ Validation middleware error:", err);
      res.status(500).json({
        success: false,
        error: "Internal validation middleware error",
      });
    }
  };
};

// ---------------------------------------------------------------------------
// Common validation schemas
// ---------------------------------------------------------------------------

// User registration
const registerSchema = Joi.object({
  body: Joi.object({
    fullName: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .required(),
  }),
});

// User login
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required(),
  }),
});

// URL shortening
const shortenUrlSchema = Joi.object({
  body: Joi.object({
    longUrl: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .max(2048)
      .required(),
    customAlias: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .optional()
      .allow(""),
  }),
});

// QR generation
const generateQrSchema = Joi.object({
  body: Joi.object({
    longUrl: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .max(2048)
      .required(),
  }),
});

// Page creation/update
const pageSchema = Joi.object({
  body: Joi.object({
    username: Joi.string()
      .lowercase()
      .trim()
      .min(3)
      .max(30)
      .pattern(/^[a-z0-9_-]+$/)
      .required(),
    profileName: Joi.string().max(100).trim().optional().allow(""),
    bio: Joi.string().max(500).trim().optional().allow(""),
    profileImage: Joi.string().uri().optional().allow(""),
    theme: Joi.string()
      .valid("custom", "lakeWhite", "lakeBlack", "airSmoke", "airSnow", "airGrey")
      .optional(),
    links: Joi.array()
      .items(
        Joi.object({
          LinkTitle: Joi.string().max(100).required(),
          LinkUrl: Joi.string().uri().required(),
          socialIcon: Joi.string().uri().optional().allow(""),
          order: Joi.number().integer().optional(),
        })
      )
      .optional(),
  }),
});

// Profile update
const profileUpdateSchema = Joi.object({
  body: Joi.object({
    fullName: Joi.string().min(2).max(100).trim().optional(),
    surname: Joi.string().max(50).trim().optional().allow(""),
    otherNames: Joi.string().max(100).trim().optional().allow(""),
    language: Joi.string().max(50).optional(),
    country: Joi.string().max(100).optional(),
  }),
});

// Password change
const passwordChangeSchema = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .required(),
  }),
});

// ObjectId validation
const objectIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
});

// Username validation
const usernameCheckSchema = Joi.object({
  params: Joi.object({
    username: Joi.string()
      .lowercase()
      .trim()
      .min(3)
      .max(30)
      .pattern(/^[a-z0-9_-]+$/)
      .required(),
  }),
});

// URL list query validation
const urlListSchema = Joi.object({
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(25).optional(),
    sort: Joi.string()
      .valid("createdAt", "clicks", "longUrl")
      .default("createdAt")
      .optional(),
    order: Joi.string().valid("asc", "desc").default("desc").optional(),
    search: Joi.string().trim().max(100).optional().allow(""),
  }).options({ stripUnknown: true }),
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
  usernameCheckSchema,
  urlListSchema,
};
