const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMemory");
const { applyDress } = require("../controllers/tryOnController.js");

// POST /api/tryon/apply-dress
// Accepts either:
//   1. JSON body with productImageUrl: { productImageUrl: "https://..." }
//   2. Multipart form-data with image file (field name: 'image')
// Requires: auth token
// Returns: AI result with both userBodyImage and productImage URLs

router.post("/apply-dress", auth, upload.single("image"), applyDress);

module.exports = router;
