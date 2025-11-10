const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
require("dotenv").config();

// In-memory storage for invalidated refresh tokens (you can use Redis or DB for production)
let blacklistedTokens = [];

// Generate Access Token
const generateAccessToken = (customerId) => {
  return jwt.sign(
    { id: customerId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME || "1h" }
  );
};

// Generate Refresh Token
const generateRefreshToken = (customerId) => {
  return jwt.sign(
    { id: customerId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME || "7d" }
  );
};

// Verify Token Helper
const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Create or Update Account
const createAccount = async (req, res) => {
  try {
    const { email, password, firstName, lastName, userType } = req.body;

    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let customer = await Customer.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!customer) {
      // Create new user
      customer = new Customer({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        userType,
      });
      await customer.save();
    } else {
      // Update existing user's password
      customer.password = hashedPassword;
      await customer.save();
    }

    res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Account creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating account",
      error: error.message,
    });
  }
};

// Login
const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = generateAccessToken(customer._id);
    const refreshToken = generateRefreshToken(customer._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      customer: {
        _id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        userType: customer.userType,
        profilePicture: customer.profilePicture,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// Refresh Access Token
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  if (blacklistedTokens.includes(refreshToken)) {
    return res.status(403).json({
      success: false,
      message: "This refresh token has been revoked (logged out)",
    });
  }

  const result = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!result.success) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }

  const newAccessToken = generateAccessToken(result.data.id);
  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken: newAccessToken,
  });
};

// Logout
const logoutAccount = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required for logout",
    });
  }

  // Add token to blacklist
  blacklistedTokens.push(refreshToken);

  res.status(200).json({
    success: true,
    message: "Logout successful. Token invalidated.",
  });
};

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const result = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
  if (!result.success) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.customer = result.data;
  next();
};

module.exports = {
  createAccount,
  loginAccount,
  refreshAccessToken,
  logoutAccount, 
  authenticateToken,
};
