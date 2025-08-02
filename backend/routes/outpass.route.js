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
  approveOutpassByWarden,
  rejectOutpassByWarden,
} from "../controllers/outpass.controller.js";

import { upload } from "../middlewares/upload.middleware.js";

import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, authorizeRoles("student"), upload.single("photo"), createOutpass);

router.get("/my", verifyToken, authorizeRoles("student"), getMyOutpasses);

router.get("/", verifyToken, authorizeRoles("warden"), getAllOutpasses);

router.get("/:id", verifyToken, getSingleOutpass);

// Update outpass status (approve/reject by admin/warden)
router.put("/:id/status", verifyToken, authorizeRoles("warden"), updateOutpassStatus);

// Delete an outpass (only by student before approval)
router.delete("/:id", verifyToken, authorizeRoles("student"), deleteOutpass);

// ----- Parent Approval -----
router.post("/:id/parent/approve", verifyToken, authorizeRoles("parent"), approveOutpassByParent);
router.post("/:id/parent/reject", verifyToken, authorizeRoles("parent"), rejectOutpassByParent);

// ----- Warden Approval -----
router.put("/:id/warden/approve", verifyToken, authorizeRoles("warden"), approveOutpassByWarden);
router.put("/:id/warden/reject", verifyToken, authorizeRoles("warden"), rejectOutpassByWarden);

export default router;
