const supabase = require("../config/supabase");

async function getUserById(user_id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getUserById };
