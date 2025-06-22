const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Original filename (e.g. 'image.jpg')
 * @returns {Promise<{ url: string }>}
 */
async function uploadFileToCloudinary(buffer, filename) {
  try {
    const base64String = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64String, {
      public_id: filename.split('.')[0],
      folder: 'visguard-ai',
    });

    return { url: result.secure_url };
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    throw new Error('Failed to upload file to Cloudinary.');
  }
}

module.exports = { uploadFileToCloudinary };
