
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const DOWNLOAD_DIR = path.join(process.cwd(), "public", "downloaded-images");

// ensure folder exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const downloadImage = async (imageUrl) => {
  const fileName = `img_${Date.now()}.jpg`;
  const filePath = path.join(DOWNLOAD_DIR, fileName);

  const response = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => resolve({ filePath, fileName }));
    writer.on("error", reject);
  });
};

 const deleteImage = async (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { downloadImage , deleteImage };
