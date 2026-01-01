// import { GoogleGenAI } from "@google/genai";
// import fs from "node:fs";
// import path from "node:path";

const fs = require("node:fs");
const path = require("node:path");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Apply dress on user using local image files
 * @param {string} userBodyFilePath
 * @param {string} userBodyFileName
 * @param {string} dressFilePath
 * @param {string} dressFileName
 */
async function applyDressWithFiles(
    userBodyFilePath,
    userBodyFileName,
    dressFilePath,
    dressFileName
) {
    try {
        console.log("DressService: Reading image files...");

        const userImageBase64 = fs
            .readFileSync(userBodyFilePath)
            .toString("base64");
        const dressImageBase64 = fs.readFileSync(dressFilePath).toString("base64");

        console.log("DressService: Calling Gemini...");

        const prompt = `
You are an expert fashion photo editor.

Image 1 shows a full-body photograph of a real person.
Image 2 shows a clothing item (dress).

Task:
- Make the person in Image 1 wear the dress from Image 2.
- Keep the person's face, identity, body shape, pose, skin tone, and background exactly the same.
- Replace only the clothing.
- Fit the dress naturally to the body.
- Add realistic fabric folds, shadows, and lighting.
- The final output must look like a real photograph.

Rules:
- Do NOT change the person's face.
- Do NOT change body proportions.
- No cartoon, no illustration, no AI-art style.
- High realism, studio-quality photo.
`;

        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: userImageBase64,
                },
            },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: dressImageBase64,
                },
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents,
            config: {
                responseModalities: ["TEXT", "IMAGE"],
                imageConfig: {
                    aspectRatio: "3:4",
                    imageSize: "2K",
                },
            },
        });

        let outputImageBase64 = null;

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
                outputImageBase64 = part.inlineData.data;
            }
        }

        if (!outputImageBase64) {
            throw new Error("No image returned by Gemini");
        }

        // Optional: save output locally
        const outputFileName = `tryon_${Date.now()}.png`;
        const outputPath = path.join("uploads", outputFileName);
        fs.writeFileSync(outputPath, Buffer.from(outputImageBase64, "base64"));

        console.log("DressService: Try-on image generated");

        return {
            success: true,
            result: {
                base64: outputImageBase64,
                localPath: outputPath,
                fileName: outputFileName,
            },
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error("DressService Error:", error);
        throw error;
    }
}


module.exports = { applyDressWithFiles };