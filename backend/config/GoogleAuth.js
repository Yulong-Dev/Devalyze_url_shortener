const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In/Sign-Up Route
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Validate token exists
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required',
      });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      });
    }

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Validate required fields from Google
    if (!email || !name || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete Google profile information',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        fullName: name,
        email,
        googleId,
        profilePicture: picture,
        isVerified: true, // Google accounts are pre-verified
      });
      isNewUser = true;
      console.log(`New user created via Google: ${email}`);
    } else if (!user.googleId) {
      // Link Google account to existing email account
      user.googleId = googleId;
      user.isVerified = true;
      if (!user.profilePicture) user.profilePicture = picture;
      await user.save();
      console.log(`Google account linked to existing user: ${email}`);
    } else {
      console.log(`Existing Google user logged in: ${email}`);
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        fullName: user.fullName 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
      },
      message: isNewUser 
        ? 'Account created successfully with Google' 
        : 'Successfully authenticated with Google',
    });
  } catch (error) {
    console.error('Google auth error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data',
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

module.exports = router;