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

// ✅ Middleware
app.use(express.json());

// ✅ CORS Setup — allow frontend domain
app.use(
  cors({
    origin: [
      "https://busbook-psi.vercel.app", // frontend on Vercel
      "http://localhost:5173",          // allow local dev too
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/user", userRoutes);         // User signup & login
app.use("/api/routes", routeRoutes);      // Route management
app.use("/api/admin", adminRoutes);       // Admin operations
app.use("/api/bus-schedule", busScheduleRoutes); // Bus schedule management

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend running successfully on Vercel!");
});

// ✅ Error handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// ✅ Local server for development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// ✅ Export for Vercel serverless
module.exports = app;
