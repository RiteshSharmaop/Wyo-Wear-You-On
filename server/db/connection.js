const mongoose = require("mongoose");
const debug = require("debug")("server:db");

async function connectDB(mongoUri) {
  if (!mongoUri) throw new Error("MONGO_URI is not defined");
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    debug("MongoDB connected");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
