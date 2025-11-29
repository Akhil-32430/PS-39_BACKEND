import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
const app = express();
// middleware
app.use(cors());
app.use(express.json());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes)
app.use("/api/users", userRoutes);
// MongoDB connection using Environment Variable
const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));