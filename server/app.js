require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

//  Dynamic + Flexible CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.31.32:5173", // ← Your current frontend IP
      "http://0.0.0.0:8000",       // FastAPI, if used directly
    ];


    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions)); // ✅ Corrected CORS

//  Cloudinary env check
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error(" Missing Cloudinary configuration in .env file");
  process.exit(1);
}

//  Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🌐 Basic Test Route
app.get("/", (req, res) => {
  res.send(" VisGuard AI Backend is Running");
});

// 🛣 Routes
app.use("/api/analyze", require("./routes/analyzeRoute"));
app.use("/api/history", require("./routes/historyRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

//  Global Error Handler
app.use((err, req, res, next) => {
  console.error("❗ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//  erver Start
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

