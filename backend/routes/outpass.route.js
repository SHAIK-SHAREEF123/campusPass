import express from "express";
import {
  createOutpass,
  getAllOutpasses,
  getMyOutpasses,
  getSingleOutpass,
  updateOutpassStatus,
  verifyQRCode,
  cancelOutpass,
  verifyEntryExit,
} from "../controllers/outpass.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, authorizeRoles("student"), createOutpass);
router.get("/my-outpasses", verifyToken, authorizeRoles("student"), getMyOutpasses);
router.get("/", verifyToken, authorizeRoles("admin", "caretaker"), getAllOutpasses);

router.get("/:id", verifyToken, authorizeRoles("student", "caretaker", "admin", "security"), getSingleOutpass);

router.put("/:id/status", verifyToken, authorizeRoles("caretaker", "admin"), updateOutpassStatus);
router.post("/verify-qr", verifyToken, authorizeRoles("caretaker", "admin"), verifyQRCode);
router.delete("/cancel/:id", verifyToken, cancelOutpass);

router.put("/:id/verify", verifyToken, authorizeRoles("security"), verifyEntryExit);

export default router;
