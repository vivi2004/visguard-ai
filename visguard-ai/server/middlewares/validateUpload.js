// middlewares/validateUpload.js

module.exports = function validateUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // Optional: Validate MIME type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Invalid file type. Only JPG, PNG, and WEBP allowed." });
  }

  next();
};
