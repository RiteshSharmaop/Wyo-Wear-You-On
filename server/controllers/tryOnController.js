const User = require("../models/User");
const { applyDressOnUser, applyDressWithFiles } = require("../services/dressService");
const { uploadBuffer } = require("../services/cloudinaryService");
const { downloadImage, deleteImage } = require("../services/imageService");

// async function applyDress(req, res) {
//   console.log("Backend: Call came for Process...");
//   const { productImageUrl } = req.body;
//   console.log("Backend: Product Image URL:", productImageUrl);

//   try {
//     // Get user's body image from database
//     const user = req.user;
//     if (!user?.bodyImageUrl) {
//       return res.status(400).json({
//         message: "User has no body image. Please upload a body image first.",
//       });
//     }
//     console.log("Backend: User body image URL:", user.bodyImageUrl);

//     // Accept productImageUrl from frontend OR dress file upload
//     let dressImageUrl = productImageUrl;

//     if (!dressImageUrl && req.file && req.file.buffer) {
//       // If no URL provided, upload the dress image file
//       console.log("Backend: Uploading dress image file to Cloudinary...");
//       const dressUploadResult = await uploadBuffer(
//         req.file.buffer,
//         "wyo_dress_images"
//       );
//       dressImageUrl = dressUploadResult.secure_url;
//     }

//     if (!dressImageUrl) {
//       return res.status(400).json({
//         message: "Dress image URL or file required",
//       });
//     }

//     console.log("Backend: Dress image URL:", dressImageUrl);

//     // Call AI service to apply dress on user body
//     // The service will download both images, convert to base64, call AI, and cleanup
//     const trialResult = await applyDressOnUser(
//       user.bodyImageUrl,
//       dressImageUrl
//     );

//     // Return success with both images and AI result
//     res.json({
//       success: true,
//       result: trialResult.result,
//       userBodyImage: user.bodyImageUrl,
//       productImage: dressImageUrl,
//       timestamp: trialResult.timestamp,
//     });
//   } catch (err) {
//     console.error("Error in applyDress:", err);
//     res.status(500).json({ message: err.message || "Dress try-on failed" });
//   }
// }
async function applyDress(req, res) {
  console.log("Backend: Call came for Process...");
  const { productImageUrl } = req.body;
  console.log("Backend: Product Image URL:");

  try {
    // Get user's body image from database
    const user = req.user;
    if (!user?.bodyImageUrl) {
      return res.status(400).json({
        message: "User has no body image. Please upload a body image first.",
      });
    }
    console.log("Backend: User body image URL:");


    // 1️⃣ Download product and user body images to local files
    const { filePath: productFilePath, fileName: productFileName } = await downloadImage(productImageUrl);
    const { filePath: userBodyFilePath, fileName: userBodyFileName } = await downloadImage(user.bodyImageUrl);

    // 2) Call file-based AI service which will clean up files itself
    console.log("Backend : LLM is Starting. Going for call");
    
    const trialResult = await applyDressWithFiles(
      userBodyFilePath,
      userBodyFileName,
      productFilePath,
      productFileName
    );
    const { success, result, timestamp } = trialResult;
    console.log("Backend : LLM given the result");
    
    // 3) Return AI result and metadata
    res.json({
      success: true,
      result: trialResult.result,
      productImageUrl,
      userBodyImage: user.bodyImageUrl,
      productFilePath,
      productFileName,
      userBodyFilePath,
      userBodyFileName,
      timestamp: trialResult.timestamp || Date.now(),
    });

  } catch (err) {
    console.error("Error in applyDress:", err);
    res.status(500).json({ message: err.message || "Dress try-on failed" });
  }
}
module.exports = { applyDress };
