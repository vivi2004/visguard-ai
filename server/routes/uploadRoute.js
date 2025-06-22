const express = require('express');
const multer = require('multer');
const router = express.Router();
const { handleImageUpload } = require('../controllers/uploadImageController');
const verifySupabaseUser = require('../middlewares/verifySupabseUser');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', verifySupabaseUser,upload.single('image'), handleImageUpload);

module.exports = router;
