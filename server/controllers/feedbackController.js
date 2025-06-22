const { getSupabaseClientWithAuth } = require("../config/supabase");

const createFeedback = async (req, res) => {
  const { analysis_id, message } = req.body;
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Missing access token" });
  }

  const supabase = getSupabaseClientWithAuth(accessToken);

  //  Get user from access token
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    return res.status(401).json({ error: "Invalid or unauthorized user" });
  }

  const userId = userData.user.id;

  if (!analysis_id || !message) {
    return res.status(400).json({ error: "analysis_id and message are required" });
  }

  const { data, error } = await supabase
    .from("feedback")
    .insert([
      {
        user_id: userId,
        analysis_id,
        message,
      },
    ])
    .select();

  if (error) {
    console.error("Insert feedback error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ feedback: data[0] });
};

module.exports = { createFeedback };
