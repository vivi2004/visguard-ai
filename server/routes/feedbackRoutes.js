const express = require("express");
const router = express.Router();
const { getSupabaseClient } = require("../config/supabase");

router.post("/", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { feedback_text, rating, analysis_id } = req.body;

    if (!feedback_text || !rating || !analysis_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const supabase = getSupabaseClient(token);
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user?.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { error: insertError } = await supabase
            .from("feedback")
            .insert([{
                user_id: user.user.id,
                analysis_id,
                feedback_text,
                rating
            }]);

        if (insertError) throw insertError;

        res.json({ success: true, message: "Feedback submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
