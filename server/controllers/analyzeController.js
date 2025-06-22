const axios = require("axios");
const { getSupabaseClient } = require("../config/supabase");
const FormData = require("form-data");

exports.handleAnalysis = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
      return res.status(400).json({ error: "Valid image URL is required" });
    }

    if (!accessToken) {
      return res.status(401).json({ error: "Missing access token" });
    }

    const supabase = getSupabaseClient(accessToken);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      console.error("User authentication failed:", userError);
      return res.status(401).json({ error: "Invalid or unauthorized user" });
    }

    const userId = user.id;
    console.log("Authenticated user ID:", userId);

    // Download image
    let imageBuffer;
    try {
      const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
      imageBuffer = Buffer.from(imageRes.data);
    } catch (imgErr) {
      console.error("Image download failed:", imgErr?.message);
      return res.status(400).json({ error: "Unable to download image from URL" });
    }

    // Get caption from FastAPI
    let captionText = null;
    try {
      const form = new FormData();
      form.append("file", imageBuffer, {
        filename: "image.jpg",
        contentType: "image/jpeg",
      });

      const captionRes = await axios.post("http://localhost:8000/caption", form, {
        headers: form.getHeaders(),
        timeout: 15000,
      });

      captionText = captionRes.data.caption;
    } catch (captionErr) {
      console.error("Captioning API error:", captionErr?.response?.data || captionErr.message);
    }

    // Detect objects using HuggingFace
    let detectedObjects = [];
    try {
      const hfRes = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
        { inputs: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      // ✅ Convert string array into array of { label, confidence }
      detectedObjects = hfRes.data
        .filter(obj => obj.score > 0.7)
        .map(obj => ({
          label: obj.label,
          confidence: obj.score * 100,
        }));
    } catch (detectErr) {
      console.error("Detection API error:", detectErr?.response?.data || detectErr.message);
    }

    if (!captionText && detectedObjects.length === 0) {
      return res.status(500).json({ error: "Both captioning and detection failed" });
    }

    // Save analysis to Supabase
    const { error: dbError } = await supabase
      .from("analyses")
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          result: {
            caption: captionText || null,
            objects: detectedObjects || null,
          },
        },
      ])
      .select();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return res.status(500).json({ error: "Failed to save analysis result" });
    }

    // 🎉 Success response
    return res.status(200).json({
      success: true,
      message: "Image analyzed and saved successfully",
      data: {
        caption: captionText,
        objects: detectedObjects,
      },
    });

  } catch (error) {
    console.error("Unexpected error in handleAnalysis:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
