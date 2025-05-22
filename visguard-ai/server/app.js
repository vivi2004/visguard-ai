// server/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (e.g., uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route (optional: for server status check)
app.get("/", (req, res) => {
  res.send("✅ VisGuard AI Backend is Running");
});

// Routes
const analyzeRoute = require("./routes/analyzeRoute");
const historyRoute = require("./routes/historyRoute");

app.use("/api/analyze", analyzeRoute);
app.use("/api/history", historyRoute);
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/auth", require("./routes/authRoute"));


// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
