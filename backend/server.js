const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({ quiet: true });

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: "Server is healthy" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
