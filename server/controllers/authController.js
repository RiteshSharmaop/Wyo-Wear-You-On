const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash: hash,
      authProvider: "local",
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        bodyImageUrl: user.bodyImageUrl,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.passwordHash) {
      return res.status(401).json({
        message: "This account uses OAuth. Please login with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        bodyImageUrl: user.bodyImageUrl,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Google OAuth callback - verify token and create/update user
async function googleCallback(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email (from local auth)
      user = await User.findOne({ email });

      if (!user) {
        // Create new user
        user = new User({
          name,
          email,
          googleId,
          googleEmail: email,
          googleImage: picture,
          authProvider: "google",
        });
      } else {
        // Link Google account to existing user
        user.googleId = googleId;
        user.googleEmail = email;
        user.googleImage = picture;
        user.authProvider = "google";
        user.name = user.name || name;
      }
    } else {
      // Update existing Google user
      user.name = name;
      user.googleEmail = email;
      user.googleImage = picture;
    }

    await user.save();

    // Create JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        bodyImageUrl: user.bodyImageUrl || user.googleImage,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}

// Get Google Client ID for frontend
function getGoogleClientId(req, res) {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID,
  });
}

module.exports = { register, login, googleCallback, getGoogleClientId };
