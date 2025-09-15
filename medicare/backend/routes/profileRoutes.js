// import express from "express";
// import { getProfile, updateProfile } from "../controllers/profileController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import multer from 'multer'; // Import multer
// import path from 'path';   // Import path
// import fs from 'fs';     // Import fs
// import User from '../models/User.js'; // Assuming your User model is here

// const router = express.Router();

// // Define the destination folder for uploads
// const uploadDir = path.join(process.cwd(), 'uploads', 'profile-pictures');

// // Ensure the upload directory exists
// const ensureDirectoryExistence = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     ensureDirectoryExistence(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const userId = req.user && req.user.id ? req.user.id : 'unknown-user';
//     cb(null, userId + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const mimetype = filetypes.test(file.mimetype);
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Images Only! Allowed types: JPEG, JPG, PNG, GIF'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
//   fileFilter: fileFilter,
// });

// router.get("/", protect, getProfile);
// router.put("/", protect, updateProfile);

// // POST route for uploading profile photo
// router.post('/upload-photo', protect, upload.single('profilePicture'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Update the user's profilePicture field with the full URL
//     user.profilePicture = `http://localhost:5000/uploads/profile-pictures/${req.file.filename}`;
//     await user.save();

//     res.status(200).json({
//       message: 'Profile picture uploaded successfully!',
//       profilePicture: user.profilePicture
//     });

//   } catch (error) {
//     console.error('Error uploading profile picture:', error);
//     if (error.message.includes('Images Only!')) {
//       return res.status(400).json({ message: error.message });
//     }
//     res.status(500).json({ message: 'Server error during photo upload.' });
//   }
// });

// export default router;
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile, uploadPhoto } from "../controllers/profileController.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("profilePicture"), uploadPhoto);

export default router;
