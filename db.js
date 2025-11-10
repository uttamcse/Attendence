// db.js
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB (only once)
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(mongoURI, {});

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;
