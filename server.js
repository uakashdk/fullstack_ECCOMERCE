import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./Config/db.js";
import authRoutes from "./routes/AuthRoute.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
dotenv.config();

// Database configuration
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Allow requests from the frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "./frontend/build")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Handle all other requests
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

// PORT
const PORT = process.env.PORT || 8080;

// Run server
app.listen(PORT, () => {
  const mode =
    process.env.NODE_ENV === "production" ? "production" : "development";
  console.log(`Server running in ${mode} mode on port ${PORT}`.bgCyan.white);
});
