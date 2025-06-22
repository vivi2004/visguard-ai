const axios = require("axios");
const mime = require("mime-types");
const FormData = require("form-data");

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const LOCAL_CAPTION_API_URL = process.env.CAPTION_API_URL || "http://localhost:8000/caption";

const MODEL_ENDPOINTS = {
  detection: "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
  caption: LOCAL_CAPTION_API_URL,
};

const hfHeaders = {
  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
};

async function downloadImageBuffer(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

async function callModel(endpoint, imageBuffer, contentType) {
  try {
    const response = await axios.post(endpoint, imageBuffer, {
      headers: {
        ...hfHeaders,
        "Content-Type": contentType || "image/jpeg",
      },
      timeout: 20000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error calling Hugging Face model at ${endpoint}`);
    console.error("Status:", error.response?.status);
    console.error("Headers:", error.response?.headers);
    console.error("Data:", error.response?.data);
    throw new Error(`Model call failed: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
  }
}

async function callCaptionModel(imageBuffer, contentType) {
  try {
    const form = new FormData();
    form.append("file", imageBuffer, {
      filename: "image.jpg",
      contentType: contentType || "image/jpeg",
    });

    const response = await axios.post(MODEL_ENDPOINTS.caption, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 20000,
    });

    return response.data;
  } catch (error) {
    console.error("Error calling local captioning model at", MODEL_ENDPOINTS.caption);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    throw new Error(`Local caption model call failed: ${error.message}`);
  }
}

async function callDetectionModel(imageBuffer, contentType) {
  return callModel(MODEL_ENDPOINTS.detection, imageBuffer, contentType);
}

async function analyzeImage(imageUrl) {
  const imageBuffer = await downloadImageBuffer(imageUrl);
  console.log("Image buffer size:", imageBuffer.length);

  const contentType = mime.lookup(imageUrl) || "image/jpeg";
  console.log("Inferred content type:", contentType);

  const [detectionRes, captionRes] = await Promise.allSettled([
    callDetectionModel(imageBuffer, contentType),
    callCaptionModel(imageBuffer),
  ]);

  const detectionResult = detectionRes.status === "fulfilled" ? detectionRes.value : null;
  const captionResult = captionRes.status === "fulfilled" ? captionRes.value : null;

  if (!detectionResult && !captionResult) {
    throw new Error("Both model calls failed.");
  }

  return {
    caption: captionResult?.generated_text || captionResult?.caption || "No caption generated",
    objects: detectionResult,
  };
}

module.exports = { analyzeImage };
