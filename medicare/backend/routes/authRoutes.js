
import express from "express";
import { sendOtp, verifyAndRegister, loginUser, adminLogin, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// -------------------- REGISTER (Send OTP) --------------------
router.post("/register", sendOtp);

// -------------------- VERIFY OTP & REGISTER --------------------
router.post("/verify-otp", verifyAndRegister);

// -------------------- LOGIN --------------------
router.post("/login", loginUser);

// -------------------- ADMIN LOGIN --------------------
router.post("/admin-login", adminLogin);

// -------------------- FORGOT / RESET PASSWORD --------------------
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
