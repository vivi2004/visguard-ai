const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const validateUpload = require("../middlewares/validateUpload");
const { handleImageUpload } = require("../controllers/uploadImageController");

router.post("/", upload.single("image"), validateUpload, handleImageUpload);

module.exports = router;
