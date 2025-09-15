// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Define the destination folder for uploads
// const uploadDir = path.join(process.cwd(), 'uploads', 'profile-pictures');

// // Ensure the upload directory exists
// const ensureDirectoryExistence = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     ensureDirectoryExistence(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename: user ID + timestamp + original file extension
//     // Assuming req.user is set by the protect middleware and contains req.user.id
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

// export default upload;
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads", "profile-pictures");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
