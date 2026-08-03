require("dotenv").config(); // Load environment variables first
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./db/db");
const path = require("path");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoute");
const aiRoutes = require("./routes/airoute");

const app = express();
const port = process.env.PORT || 4000;

// 🔹 Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or allowed origins
      if (!origin || origin.includes("localhost") || origin.includes("onrender.com")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Connect to Database
connectdb()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// 🔹 Basic Testing Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// 🔹 OAuth Routes (Google & GitHub)
const {
  googleAuthRedirect,
  googleAuthCallback,
  githubAuthRedirect,
  githubAuthCallback,
} = require("./controllers/userControllers");

app.get("/auth/google", googleAuthRedirect);
app.get("/auth/google/callback", googleAuthCallback);

// GitHub OAuth Endpoints
app.get("/auth/github", githubAuthRedirect);
app.get("/auth/github/callback", githubAuthCallback);
app.get("/api/auth/github", githubAuthRedirect);
app.get("/api/auth/github/callback", githubAuthCallback);

// 🔹 Define Module Routes
app.use("/products", productRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", userRoutes);
app.use("/home", homeRoutes);
app.use("/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/ai-help", aiRoutes);

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, "client/build")));

// React fallback route for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// 🔹 Start Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
