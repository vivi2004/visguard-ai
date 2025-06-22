const { uploadFileToCloudinary } = require('../services/cloudinaryService');
const { supabase } = require('../config/supabase');

async function handleImageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing user ID' });
    }

    const fileBuffer = req.file.buffer;
    const filename = req.file.originalname;

    const { url } = await uploadFileToCloudinary(fileBuffer, filename);

    const { data, error } = await supabase
      .from('images')
      .insert([{ image_url: url, user_id: userId }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return res.status(500).json({ error: 'Failed to save image URL to Supabase' });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Insert succeeded but no data returned' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      url,
      record: data[0],
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}

module.exports = { handleImageUpload };
  
