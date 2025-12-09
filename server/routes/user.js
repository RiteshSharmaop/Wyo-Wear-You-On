const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMemory");
const {
  getProfile,
  uploadBodyImage,
} = require("../controllers/userController");

router.get("/me", auth, getProfile);
router.post("/me/upload", auth, upload.single("image"), uploadBodyImage);

module.exports = router;
