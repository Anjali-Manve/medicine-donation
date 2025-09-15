
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile, uploadPhoto } from "../controllers/profileController.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("profilePicture"), uploadPhoto);

export default router;
