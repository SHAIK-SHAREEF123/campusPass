import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import outpassRoutes from "./routes/outpass.route.js";
import hostelRoutes from "./routes/hostel.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  // optionsSuccessStatus: 200,
}));

app.use(cookieParser());
app.use(express.json());

// Allow form-data parsing for file uploads
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/outpass", outpassRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("CampusPass API is running");
});

const PORT = process.env.PORT || 5000;
try {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
} catch (error) {
  console.error(error);
}
