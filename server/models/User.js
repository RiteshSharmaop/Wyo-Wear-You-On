const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String },
  bodyImageUrl: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  googleEmail: { type: String },
  googleImage: { type: String },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
