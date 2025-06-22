// server/middlewares/uploadMiddleware.js

const multer = require("multer");
const path = require("path");

// Only accept common image extensions
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const ext = path.extname(file.originalname).toLowerCase();
  if (isImage && [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only image files are allowed."), false);
  }
};

// In-memory storage (no writing to disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
