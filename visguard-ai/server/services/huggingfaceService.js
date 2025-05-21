const axios = require("axios");
const fs = require("fs");

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Replace with your Hugging Face model endpoints
const MODEL_ENDPOINTS = {
  detection: "https://api-inference.huggingface.co/models/YOUR_MODEL_NAME",
  caption: "https://api-inference.huggingface.co/models/YOUR_MODEL_NAME",
};

const headers = {
  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
};

async function analyzeImage(filePath) {
  const imageBuffer = fs.readFileSync(filePath);

  const detectionResponse = await axios.post(MODEL_ENDPOINTS.detection, imageBuffer, {
    headers: {
      ...headers,
      "Content-Type": "application/octet-stream",
    },
  });

  const captionResponse = await axios.post(MODEL_ENDPOINTS.caption, imageBuffer, {
    headers: {
      ...headers,
      "Content-Type": "application/octet-stream",
    },
  });

  return {
    caption: captionResponse.data[0]?.generated_text || "No caption generated",
    objects: detectionResponse.data,
  };
}

module.exports = { analyzeImage };
