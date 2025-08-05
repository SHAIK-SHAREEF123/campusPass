import express from "express";
import { getStudentDashboard, caretakerDashboard } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.get("/student", verifyToken, authorizeRoles("student"), getStudentDashboard);
router.get("/caretaker", verifyToken, authorizeRoles("caretaker"), caretakerDashboard);

export default router;
