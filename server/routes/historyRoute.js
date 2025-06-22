const express = require("express");
const router = express.Router();
const { getUserHistory, deleteUserHistory } = require("../controllers/historyController");

// GET /api/history - fetch from Supabase
router.get("/", getUserHistory);
router.get("/", deleteUserHistory);


module.exports = router;
