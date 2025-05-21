
const { uploadImage } = require("../services/storageService");
const { v4: uuidv4 } = require("uuid");

async function handleImageUpload(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `${uuidv4()}-${file.originalname}`;
    const result = await uploadImage(file.buffer, fileName, file.mimetype);

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${result.path}`;
    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Image upload failed" });
  }
}

module.exports = { handleImageUpload };
