import express from "express";
import {
  createOutpass,
  getAllOutpasses,
  getMyOutpasses,
  getSingleOutpass,
  updateOutpassStatus,
  deleteOutpass,
  approveOutpassByParent,
  rejectOutpassByParent,
  approveOutpassByCaretaker,
  rejectOutpassByCaretaker,
  verifyQRCode,
} from "../controllers/outpass.controller.js";

import { upload } from "../middlewares/upload.middleware.js";

import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, authorizeRoles("student"), upload.single("photo"), createOutpass);

router.get("/my", verifyToken, authorizeRoles("student"), getMyOutpasses);

router.get("/", verifyToken, authorizeRoles("caretaker"), getAllOutpasses);

router.get("/:id", verifyToken, getSingleOutpass);

// Update outpass status (approve/reject by admin/warden)
router.put("/:id/status", verifyToken, authorizeRoles("caretaker"), updateOutpassStatus);

// Delete an outpass (only by student before approval)
router.delete("/:id", verifyToken, authorizeRoles("student"), deleteOutpass);

// Parent approval
router.post("/:id/parent/approve", verifyToken, authorizeRoles("parent"), approveOutpassByParent);
router.post("/:id/parent/reject", verifyToken, authorizeRoles("parent"), rejectOutpassByParent);

// Caretaker approval
router.put("/:id/caretaker/approve", verifyToken, authorizeRoles("caretaker"), approveOutpassByCaretaker);
router.put("/:id/caretaker/reject", verifyToken, authorizeRoles("caretaker"), rejectOutpassByCaretaker);

router.post('/verify-qr', verifyQRCode);


export default router;
