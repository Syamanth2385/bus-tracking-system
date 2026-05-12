const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;
    email = email ? email.trim() : email;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const identifier = email ? email.trim() : '';

    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        provider: user.provider || 'local',
        profilePicture: user.profilePicture,
        lastLoginTime: user.lastLoginTime,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    OAuth callback to handle login/register
// @route   POST /api/auth/oauth-callback
// @access  Public
const oauthCallback = async (req, res) => {
  try {
    const { code, provider } = req.body;
    // In a real app, we would exchange `code` for an access token with Google/GitHub,
    // and then fetch the user's profile. Here we simulate this by creating a mock email.
    // Use a deterministic dummy email based on the code length or just a random one.
    const fakeEmail = `oauth_${code.substring(0, 5)}@${provider}.com`;
    const fakeName = `${provider} User ${code.substring(0, 3)}`;
    
    let user = await User.findOne({ email: fakeEmail });

    if (!user) {
      // Create account automatically
      user = await User.create({
        name: fakeName,
        email: fakeEmail,
        password: `OAuth_${Date.now()}_Secret!`, // Random password they don't know
        provider: provider,
        profilePicture: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
        lastLoginTime: Date.now()
      });
    } else {
      user.lastLoginTime = Date.now();
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      provider: user.provider,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Real Google Sign-In using Access Token
// @route   POST /api/auth/google
// @access  Public
const axios = require('axios');
const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;
    
    // Fetch user profile from Google
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    const email = data.email;
    const name = data.name;
    const profilePicture = data.picture;
    
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: `OAuth_${Date.now()}_Secret!`, // Random password they don't know
        provider: 'google',
        profilePicture,
        lastLoginTime: Date.now()
      });
    } else {
      user.lastLoginTime = Date.now();
      if (!user.profilePicture || user.profilePicture.includes('ui-avatars')) {
        user.profilePicture = profilePicture;
      }
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      provider: user.provider,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.oldPassword && req.body.newPassword) {
        if (await user.matchPassword(req.body.oldPassword)) {
          user.password = req.body.newPassword;
        } else {
          return res.status(401).json({ message: 'Incorrect old password' });
        }
      }
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (await user.matchPassword(req.body.oldPassword)) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(401).json({ message: 'Incorrect old password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  oauthCallback,
  googleAuth,
  updateProfile,
  changePassword,
};
