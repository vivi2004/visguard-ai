const supabase = require("../config/supabase");

async function saveAnalysis({ user_id, image_url, caption, objects }) {
  const { data, error } = await supabase.from("analyses").insert([
    {
      user_id,
      image_url,
      caption,
      objects,
    },
  ]);

  if (error) throw error;
  return data;
}

async function getUserAnalyses(user_id) {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user_id)
    .order("analyzed_at", { ascending: false });

  if (error) throw error;
  return data;
}

module.exports = {
  saveAnalysis,
  getUserAnalyses,
};
