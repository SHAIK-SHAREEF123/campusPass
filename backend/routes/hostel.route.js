import express from "express";
import {
  createHostel,
  assignCaretakerToHostel,
  getAllHostels,
  getHostelById,
  createBatchInHostel,
  addStudentToBatch,
  getStudentsInBatch,
  renameBatch,
  deleteBatch,
  removeStudentFromBatch
} from "../controllers/hostel.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

//(Admin only)
router.post("/create", verifyToken, authorizeRoles("admin"), createHostel);

//(Admin only)
router.put("/:hostelId/assign-caretaker",verifyToken,authorizeRoles("admin"),assignCaretakerToHostel);

//(Admin only)
router.get("/", verifyToken, authorizeRoles("admin"), getAllHostels);

// Get single hostel details
router.get("/:hostelId", verifyToken, getHostelById);

// Caretaker creates a batch
router.post("/:hostelId/create-batch",verifyToken,authorizeRoles("caretaker"),createBatchInHostel);

// Caretaker adds student to batch
router.post("/:hostelId/batch/:batchName/add-student", verifyToken, authorizeRoles("caretaker"), addStudentToBatch);

// Rename a batch
router.put("/:hostelId/batch/:batchId/rename",verifyToken,authorizeRoles("caretaker"),renameBatch);

// Delete a batch
router.delete("/:hostelId/batch/:batchId",verifyToken,authorizeRoles("caretaker"),deleteBatch);

router.get("/:hostelId/batch/:batchName/students",verifyToken,authorizeRoles("caretaker"),getStudentsInBatch);

router.delete("/:hostelId/batches/:batchName/remove-student/:studentId",verifyToken,authorizeRoles("caretaker"),removeStudentFromBatch);
export default router;