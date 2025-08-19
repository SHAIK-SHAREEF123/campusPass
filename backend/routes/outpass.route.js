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

// import { upload } from "../middlewares/upload.middleware.js";

import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, authorizeRoles("student"), createOutpass);

router.get("/my-outpasses", verifyToken, authorizeRoles("student"), getMyOutpasses);

router.get("/", verifyToken, authorizeRoles("admin","caretaker"), getAllOutpasses);

router.get("/:id",verifyToken,authorizeRoles("student", "parent", "caretaker", "admin"),getSingleOutpass);

// Update outpass status (approve/reject by admin/warden)
router.put("/:id/status", verifyToken, authorizeRoles("caretaker"), updateOutpassStatus);

// Delete an outpass (only by student before approval)
router.delete("/:id", verifyToken, authorizeRoles("student"), deleteOutpass);

// Parent approval
router.put("/:id/parent/approve", verifyToken, authorizeRoles("parent"), approveOutpassByParent);
router.put("/:id/parent/reject", verifyToken, authorizeRoles("parent"), rejectOutpassByParent);

// Caretaker approval
router.put("/:id/caretaker/approve", verifyToken, authorizeRoles("caretaker"), approveOutpassByCaretaker);
router.put("/:id/caretaker/reject", verifyToken, authorizeRoles("caretaker"), rejectOutpassByCaretaker);

router.post('/verify-qr',verifyToken, authorizeRoles("caretaker", "admin"), verifyQRCode); //security as authorizeRoles


export default router;
