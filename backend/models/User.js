const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
  },
  surname: {
    type: String,
    trim: true,
    maxlength: [50, 'Surname cannot exceed 50 characters'],
  },
  otherNames: {
    type: String,
    trim: true,
    maxlength: [100, 'Other names cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true,
  },
  pendingEmail: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Only required if not using Google
    },
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        // Skip validation for Google users or if password is already hashed
        if (!v && this.googleId) return true;
        if (v && v.startsWith('$2a$') || v.startsWith('$2b$')) return true; // Already hashed
        
        // Validate password strength for new passwords
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  passwordHistory: [{
    hash: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpires: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
    default: 'en',
  },
  country: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for token-based queries only (email and googleId already indexed in schema)
userSchema.index({ verificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ⚠️ CRITICAL: Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function(next) {
  // Skip if password is not modified or doesn't exist
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // Skip if password is already hashed
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }
  
  try {
    // Save old password to history before hashing new one
    if (this.isModified('password') && !this.isNew && this.password) {
      const oldPassword = await this.constructor.findById(this._id).select('password');
      if (oldPassword && oldPassword.password) {
        this.passwordHistory = this.passwordHistory || [];
        this.passwordHistory.push({
          hash: oldPassword.password,
          changedAt: new Date()
        });
        
        // Keep only last 5 passwords
        if (this.passwordHistory.length > 5) {
          this.passwordHistory = this.passwordHistory.slice(-5);
        }
      }
    }

    // Hash the new password with 12 rounds (more secure than 10)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method: Compare passwords with timing attack protection
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    // Still perform a dummy comparison to prevent timing attacks
    await bcrypt.compare(
      candidatePassword, 
      '$2b$12$invalidhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    );
    return false;
  }
  
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method: Check if password was used before
userSchema.methods.isPasswordReused = async function(newPassword) {
  if (!this.passwordHistory || this.passwordHistory.length === 0) {
    return false;
  }

  for (const oldPass of this.passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, oldPass.hash);
    if (isMatch) return true;
  }
  
  return false;
};

// Instance method: Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If previous lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  // Lock account after max attempts
  const attemptsReached = this.loginAttempts + 1 >= maxAttempts;
  if (attemptsReached && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Instance method: Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Instance method: Get public profile
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    fullName: this.fullName,
    surname: this.surname,
    otherNames: this.otherNames,
    email: this.email,
    profilePicture: this.profilePicture,
    isVerified: this.isVerified,
    language: this.language,
    country: this.country,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// Instance method: Update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return this.save();
};

// Instance method: Generate verification token
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token; // Return unhashed token to send via email
};

// Instance method: Generate password reset token
userSchema.methods.generateResetPasswordToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token; // Return unhashed token to send via email
};

// Static method: Find by email (case-insensitive)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method: Find by verification token
userSchema.statics.findByVerificationToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() }
  });
};

// Static method: Find by reset password token
userSchema.statics.findByResetToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
};

// Error handling for unique constraint violations (avoid email enumeration)
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Use generic error message to prevent email enumeration
    next(new Error('Registration failed. Please try again with different credentials.'));
  } else if (error.name === 'ValidationError') {
    // Pass validation errors through
    next(error);
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);