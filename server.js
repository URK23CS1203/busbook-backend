const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Route imports
const userRoutes = require("./routes/userRoutes");
const routeRoutes = require("./routes/routeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const busScheduleRoutes = require("./routes/busScheduleRoutes");

const app = express();

// ✅ CORS Setup — allow frontend domain
app.use(
  cors({
    origin: "https://busbook-psi.vercel.app", // your frontend Vercel link
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/user", userRoutes); // User signup & login
app.use("/api/routes", routeRoutes); // Route management
app.use("/api/admin", adminRoutes); // Admin operations
app.use("/api/bus-schedule", busScheduleRoutes); // Bus schedule management

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Basic test routes
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully on Vercel!");
});

app.get("/login", (req, res) => {
  res.send("🔐 Login endpoint active. Use frontend for actual login UI.");
});

app.get("/home", (req, res) => {
  res.send("🏠 Home route working fine.");
});

// ✅ Error handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start server (for local testing)
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server running locally on port ${PORT}`);
});

// ✅ Export app for Vercel serverless functions
module.exports = app;
