const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Upload image to Supabase Storage (bucket: "images")
 */
async function uploadImage(fileBuffer, fileName, mimeType) {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw error;

  return data;
}

module.exports = { uploadImage };
