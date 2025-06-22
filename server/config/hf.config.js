require("dotenv").config();

console.log("🔐 Hugging Face API key loaded:", !!HUGGINGFACE_API_KEY);

module.exports = {
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  PORT: process.env.PORT || 5000,
};
