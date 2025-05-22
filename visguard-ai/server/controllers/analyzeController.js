const { analyzeImage } = require("../services/huggingfaceService");
const path = require("path");
const fs = require("fs");

exports.handleAnalysis = async (req, res, next) => {
  try {
    const filePath = req.file.path;

    const results = await analyzeImage(filePath);

    res.json({
      success: true,
      message: "Analysis complete",
      data: results,
    });

    // Optional: Clean up uploaded image
    // fs.unlinkSync(filePath);
  } catch (error) {
    next(error);
  }
};
 