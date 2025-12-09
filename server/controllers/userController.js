const User = require("../models/User");
const { uploadBuffer } = require("../services/cloudinaryService");

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function uploadBodyImage(req, res) {
  try {
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Image file required" });
    const result = await uploadBuffer(req.file.buffer, "wyo_body_images");
    const url = result.secure_url;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bodyImageUrl: url },
      { new: true }
    ).select("-passwordHash");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
}

module.exports = { getProfile, uploadBodyImage };
