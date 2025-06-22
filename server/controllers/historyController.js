const { getSupabaseClient } = require("../config/supabase");

async function getUserHistory(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const supabase = getSupabaseClient(token);
    const { data: authData, error: authError } = await supabase.auth.getUser();

    const user = authData?.user;
    if (authError || !user) {
        return res.status(401).json({ error: "Invalid user token" });
    }

    const { page = 1, limit = 10, caption, date } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
        .from("analyses")
        .select("id, image_url, caption, objects, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (caption) {
        query = query.ilike("caption", `%${caption}%`);
    }

    if (date) {
        const from = `${date}T00:00:00`;
        const to = `${date}T23:59:59`;
        query = query.gte("created_at", from).lte("created_at", to);
    }

    const { data, error } = await query;
    if (error) {
        return res.status(500).json({ error: "Failed to fetch history" });
    }

    res.json({
        success: true,
        message: "History fetched successfully",
        data,
    });
}

async function deleteUserHistory(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const supabase = getSupabaseClient(token);
    const { data: authData, error: authError } = await supabase.auth.getUser();

    const user = authData?.user;
    if (authError || !user) {
        return res.status(401).json({ error: "Invalid user token" });
    }

    const { beforeDate } = req.query;

    let deleteQuery = supabase.from("analyses").delete().eq("user_id", user.id);
    if (beforeDate) {
        deleteQuery = deleteQuery.lt("created_at", `${beforeDate}T23:59:59`);
    }

    const { error } = await deleteQuery;
    if (error) {
        return res.status(500).json({ error: "Failed to delete history" });
    }

    res.json({
        success: true,
        message: "User history deleted successfully",
    });
}

module.exports = {
    getUserHistory,
    deleteUserHistory,
};

