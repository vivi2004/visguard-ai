// services/imageService.js

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Upload image buffer to Supabase Storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Filename to store as
 * @param {string} mimeType - MIME type of the file
 */
async function uploadImageToSupabase(fileBuffer, fileName, mimeType) {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw new Error("Image upload failed: " + error.message);
  return data;
}

/**
 * Generate a public URL for the uploaded image
 * @param {string} filePath - The full path inside the Supabase bucket
 */
function getPublicUrl(filePath) {
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}

module.exports = {
  uploadImageToSupabase,
  getPublicUrl,
};

