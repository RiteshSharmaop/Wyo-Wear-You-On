const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

const OPEN_ROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "google/gemini-2.5-flash-image";

// Download image from URL and save to temp folder
async function downloadImage(imageUrl, filename) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const tempDir = path.join(os.tmpdir(), "wyo-dress-tryon");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, response.data);
    console.log(`Downloaded image to: ${filepath}`);
    return { filePath: filepath, fileName: filename };
  } catch (err) {
    console.error(`Error downloading image: ${err.message}`);
    throw err;
  }
}

// Delete a file safely
function deleteFile(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`Deleted temp file: ${filepath}`);
    }
  } catch (err) {
    console.error(`Error deleting file ${filepath}: ${err.message}`);
  }
}

// Save generated image from LLM (base64, data URL, or URL) to public/llmgeneratedimage
async function saveGeneratedImage(imageData) {
  const outputDir = path.join(process.cwd(), "public", "llmgeneratedimage");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `generated-${Date.now()}.jpg`;
  const filePath = path.join(outputDir, fileName);

  try {
    // Case 1: base64 string (no data: prefix)
    if (!imageData.startsWith("data:") && !imageData.startsWith("http")) {
      fs.writeFileSync(filePath, Buffer.from(imageData, "base64"));
      console.log(`Saved generated image to: ${filePath}`);
      return { filePath, fileName, fileUrl: `/llmgeneratedimage/${fileName}` };
    }

    // Case 2: data URL (data:image/jpeg;base64,...)
    if (imageData.startsWith("data:")) {
      const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (matches && matches[2]) {
        fs.writeFileSync(filePath, Buffer.from(matches[2], "base64"));
        console.log(`Saved generated image to: ${filePath}`);
        return {
          filePath,
          fileName,
          fileUrl: `/llmgeneratedimage/${fileName}`,
        };
      }
      throw new Error("Invalid data URL format");
    }

    // Case 3: HTTP URL - download and save
    if (imageData.startsWith("http")) {
      const response = await axios.get(imageData, {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(filePath, Buffer.from(response.data));
      console.log(`Downloaded and saved generated image to: ${filePath}`);
      return { filePath, fileName, fileUrl: `/llmgeneratedimage/${fileName}` };
    }

    throw new Error("Unrecognized image data format");
  } catch (err) {
    console.error(`Error saving generated image: ${err.message}`);
    throw err;
  }
}

// URL-based entry: downloads both images and delegates to file-based impl
async function applyDressOnUser(bodyImageUrl, dressImageUrl) {
  if (!process.env.OPEN_ROUTER_API_KEY) {
    throw new Error("OPEN_ROUTER_API_KEY not configured");
  }

  if (!bodyImageUrl || !dressImageUrl) {
    throw new Error("bodyImageUrl and dressImageUrl are required");
  }

  const bodyFileName = `body-${Date.now()}.jpg`;
  const dressFileName = `dress-${Date.now()}.jpg`;

  const { filePath: bodyFilePath } = await downloadImage(
    bodyImageUrl,
    bodyFileName
  );
  const { filePath: dressFilePath } = await downloadImage(
    dressImageUrl,
    dressFileName
  );

  // Delegate to the file-based implementation which will clean up files
  return applyDressWithFiles(
    bodyFilePath,
    bodyFileName,
    dressFilePath,
    dressFileName
  );
}

// file-path based implementation: accepts local file paths and file names
async function applyDressWithFiles(
  userBodyFilePath,
  userBodyFileName,
  productFilePath,
  productFileName
) {
  console.log("LLM : Call Came to LLM");

  if (!process.env.OPEN_ROUTER_API_KEY) {
    throw new Error("OPEN_ROUTER_API_KEY not configured");
  }

  try {
    console.log("LLM : Converting to base64");
    // Read files as base64
    const userBodyBase64 = fs.readFileSync(userBodyFilePath, "base64");
    const productBase64 = fs.readFileSync(productFilePath, "base64");

    console.log(`LLM : Converted to base64`);
    const prompt = `
      You are a professional fashion AI. 
      I have a body image (full body photo of a person) 
      and a dress/clothing image.\n\n
      Please perform the following task:\n
      1. Take the dress/clothing from the dress image (${productFileName}):\n
      2. Apply it realistically on the person in the body image (${userBodyFileName})\n
      3. Ensure the dress fits naturally and looks realistic. Preserve face, body pose, lighting, and proportions\n
      4. Return only the final image of the person wearing the dress Return ONLY a base64-encoded JPEG image\n
      5.No explanation, no markdown, no extra text
      `;

    let response;
    try {
      response = await axios.post(
        `${OPEN_ROUTER_BASE_URL}/chat/completions`,
        {
          model: MODEL,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${userBodyBase64}`,
                  },
                },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${productBase64}` },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
            "x-api-key": process.env.OPEN_ROUTER_API_KEY,
          },
        }
      );
    } catch (err) {
      if (err.response) {
        console.error("OpenRouter API error status:", err.response.status);
        console.error("OpenRouter API error data:", err.response.data);
        throw new Error(
          `OpenRouter API request failed: ${
            err.response.status
          } - ${JSON.stringify(err.response.data)}`
        );
      }
      console.error("OpenRouter request error:", err.message);
      throw err;
    }

    const resultData = response.data;
    console.log("LLM : Response :", resultData);

    // Try to extract generated image/result from several possible response shapes
    let aiResponse = null;
    const choice = resultData?.choices?.[0];
    const message = choice?.message;

    // 1) message.content as string (data URL or base64)
    if (message) {
      if (typeof message.content === "string") {
        aiResponse = message.content;
      } else if (Array.isArray(message.content)) {
        // content may be an array of blocks; look for image_url entries
        for (const block of message.content) {
          if (block?.image_url?.url) {
            aiResponse = block.image_url.url;
            break;
          }
          if (typeof block === "string" && block.startsWith("data:image")) {
            aiResponse = block;
            break;
          }
        }
      }

      // 2) message.images array
      if (
        !aiResponse &&
        Array.isArray(message.images) &&
        message.images.length > 0
      ) {
        const img = message.images[0];
        aiResponse = img?.image_url?.url || img?.url || img;
      }

      // 3) message.image_url
      if (!aiResponse && message.image_url) {
        aiResponse = message.image_url.url || message.image_url;
      }
    }

    // 4) fallback: some providers embed generated image under data or output
    if (!aiResponse && resultData?.data) {
      // attempt common locations
      const d = resultData.data;
      if (d?.output?.images && d.output.images.length)
        aiResponse = d.output.images[0];
      else if (d?.images && d.images.length) aiResponse = d.images[0];
    }

    if (!aiResponse) {
      console.error(
        "Unrecognized OpenRouter response shape, full payload:",
        JSON.stringify(resultData).substring(0, 1000)
      );
      throw new Error("Invalid response from Open Router API - no image found");
    }

    // Save the generated image to public/llmgeneratedimage
    console.log("LLM : Saving generated image...");
    const savedImage = await saveGeneratedImage(aiResponse);
    console.log("LLM : Generated image saved to:", savedImage.fileUrl);

    return {
      success: true,
      result: aiResponse,
      savedImageUrl: savedImage.fileUrl,
      timestamp: new Date(),
    };
  } catch (err) {
    console.error("Error in applyDressWithFiles:", err.message);
    throw err;
  } finally {
    // cleanup local files
    try {
      if (fs.existsSync(userBodyFilePath)) fs.unlinkSync(userBodyFilePath);
      if (fs.existsSync(productFilePath)) fs.unlinkSync(productFilePath);
    } catch (e) {
      console.error("Error cleaning up files:", e.message);
    }
  }
}

module.exports = {
  applyDressOnUser,
  applyDressWithFiles,
  downloadImage,
  deleteFile,
  saveGeneratedImage,
};
