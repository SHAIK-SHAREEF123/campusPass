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
  removeStudentFromBatch,
  deleteHostel,
  getAllCaretakers,
  getCaretakersByHostelName,
  removeCaretakerFromHostel
} from "../controllers/hostel.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

//(Admin only)
router.post("/create", verifyToken, authorizeRoles("admin"), createHostel);

//(Admin only)
router.post("/assign-caretaker", verifyToken, authorizeRoles("admin"), assignCaretakerToHostel);

router.get("/", verifyToken, getAllHostels);


// Caretaker creates a batch
router.post("/:hostelId/create-batch",verifyToken,authorizeRoles("admin", "caretaker"),createBatchInHostel);

// Caretaker adds student to batch
router.post("/:hostelId/batch/:batchId/add-student", verifyToken, authorizeRoles("admin","caretaker"), addStudentToBatch);

// Rename a batch
router.put("/:hostelId/batch/:batchId/rename",verifyToken,authorizeRoles("admin","caretaker"),renameBatch);

//Delete a hostel
router.delete("/:hostelId", verifyToken, authorizeRoles("admin"), deleteHostel);

// Delete a batch
router.delete("/:hostelId/batch/:batchId",verifyToken,authorizeRoles("admin", "caretaker"),deleteBatch);

router.get("/:hostelId/batch/:batchId/students",verifyToken,authorizeRoles("admin","caretaker","student"),getStudentsInBatch);

router.delete("/:hostelId/batch/:batchId/remove-student/:studentId",verifyToken,authorizeRoles("admin","caretaker"),removeStudentFromBatch);

router.get("/caretakers", verifyToken, authorizeRoles("admin"), getAllCaretakers);

router.get("/:hostelName/caretakers",verifyToken,authorizeRoles("admin"),getCaretakersByHostelName);

router.post("/remove-caretaker", verifyToken, authorizeRoles("admin"),removeCaretakerFromHostel);


// Get single hostel details
router.get("/:hostelId", verifyToken, getHostelById);

export default router;