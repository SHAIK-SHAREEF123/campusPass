import express from "express";
import {
  register,
  login,
  googleLogin,
  logout,
  getMyProfile,
  updateMyProfile,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
} from "../validators/authValidators.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google-login", validate(googleLoginSchema), googleLogin);
router.post("/logout", logout);

router.get("/me", verifyToken, getMyProfile);
router.put("/update", verifyToken, updateMyProfile);

export default router;
