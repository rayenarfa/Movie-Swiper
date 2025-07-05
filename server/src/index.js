const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route - helpful for debugging
app.get("/", (req, res) => {
  res.json({
    message: "🎬 MovieSwiper API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      movies: "/api/movies",
      auth: "/api/auth",
      user: "/api/user",
    },
    environment: process.env.NODE_ENV || "development",
  });
});

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "MovieSwiper API is running" });
});

// Routes
const moviesRouter = require("./routes/movies");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

app.use("/api/movies", moviesRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api/movies",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/user/saved",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
