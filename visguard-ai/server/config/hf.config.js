require("dotenv").config();

module.exports = {
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  PORT: process.env.PORT || 5000,
};
