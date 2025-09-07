import express from "express";
import {
  signup,
  login,
  googleLogin,
  logout,
  // getMyProfile,
  updateMyProfile,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
} from "../validators/authValidators.js";

import { upload } from '../config/cloudinary.js';
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", upload.single('profilePhoto'), validate(registerSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/google-login", validate(googleLoginSchema), googleLogin);
router.post("/logout", logout);

// router.get("/profile", verifyToken, getMyProfile);
router.put("/profile/update", verifyToken, upload.single("profilePhoto"), updateMyProfile);



export default router;
