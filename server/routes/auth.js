const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleCallback,
  getGoogleClientId,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleCallback);
router.get("/google-client-id", getGoogleClientId);

module.exports = router;
