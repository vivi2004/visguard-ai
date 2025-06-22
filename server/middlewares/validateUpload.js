// middlewares/validateUpload.js
const { body, validationResult } = require("express-validator");

module.exports = [
  // Validate file exists using express-validator
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("No image file uploaded");
    }
    return true;
  }),

  // Validate file type and size
  (req, res, next) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Check MIME type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type",
        details: {
          allowedTypes: ["JPEG", "PNG", "WEBP"],
          receivedType: req.file.mimetype,
        },
      });
    }

    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: "File size exceeded",
        details: {
          maxSize: `${maxSize / (1024 * 1024)}MB`,
          actualSize: `${(req.file.size / (1024 * 1024)).toFixed(2)}MB`,
        },
      });
    }

    // Check file extension
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExtension = req.file.originalname
      .slice(((req.file.originalname.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
      return res.status(400).json({
        error: "Invalid file extension",
        details: {
          allowedExtensions: validExtensions,
          receivedExtension: fileExtension,
        },
      });
    }

    next();
  },

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];
