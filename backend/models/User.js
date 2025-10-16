const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Only required if not using Google
    },
    minlength: [8, 'Password must be at least 8 characters'],
  },
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
  lastLogin: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// ⚠️ CRITICAL: Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function(next) {
  // Skip if password is not modified or doesn't exist
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method: Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false; // Google users don't have passwords
  }
  
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
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
    createdAt: this.createdAt,
  };
};

// Instance method: Update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method: Find by email (case-insensitive)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Error handling for unique constraint violations
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    if (error.keyPattern.email) {
      next(new Error('Email already exists'));
    } else if (error.keyPattern.googleId) {
      next(new Error('Google account already linked'));
    } else {
      next(new Error('Duplicate key error'));
    }
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);