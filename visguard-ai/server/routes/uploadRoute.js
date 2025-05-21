
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { handleImageUpload } = require("../controllers/uploadImageController");

router.post("/", upload.single("image"), handleImageUpload);

module.exports = router;
