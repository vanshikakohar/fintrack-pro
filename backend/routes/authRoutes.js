import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // since you exported default

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, updateUserProfile);

export default router;
