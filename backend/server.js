import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CampusPass API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
