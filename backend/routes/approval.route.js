import express from "express";
import {
  approveOutpassByParent,
  approveOutpassByWarden,
} from "../controllers/approval.controller.js";

import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

// Parent Approval Route
router.put(
  "/parent/approve/:id",
  verifyToken,
  authorizeRoles("parent"),
  approveOutpassByParent
);

// Warden Approval Route
router.put(
  "/warden/approve/:id",
  verifyToken,
  authorizeRoles("warden"),
  approveOutpassByWarden
);

export default router;
