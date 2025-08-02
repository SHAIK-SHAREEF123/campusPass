import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import outpassRoutes from "./routes/outpass.route.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());  
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use("/api/auth", authRoutes);
app.use("/api/outpass", outpassRoutes);

app.get("/", (req, res) => {
  res.send("CampusPass API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
