const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secret_key = process.env.JWT_SECRET;

const googleAuthController = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, msg: "No token provided" });
    }

    const googleUserInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { email, sub: googleId, name, picture } = googleUserInfo.data;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email not provided by Google" });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.googleId = googleId;
      user.userimage = picture || user.userimage;
      user.name = name || user.name;
      await user.save();
    } else {
      const password = googleId + process.env.JWT_SECRET; // More secure password
      user = new User({
        name,
        email,
        password,
        role: 'user',
        userimage: picture,
        googleId,
        isGoogleUser: true
      });
      await user.save();
    }

    const authToken = jwt.sign(
      { userId: user._id }, 
      secret_key, 
      { expiresIn: '1d' }
    );

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.googleId;

    return res.status(200).json({
      success: true,
      msg: "Google authentication successful",
      token: authToken,
      userId: user._id,
      user: userResponse
    });

  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ 
      success: false,
      msg: "Authentication failed",
      error: error.message 
    });
  }
};

module.exports = { googleAuthController };
