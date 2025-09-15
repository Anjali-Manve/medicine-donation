import express from "express";
import {
  getDonors,
  getReceivers,
  getMedicines,
  getReviews,
  getProfiles,
  getStats,
  getAllUsers,
  addUser,
  editUser,
  deleteUser
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ All admin routes are protected & admin-only
router.get("/donors", protect, authorizeRoles("admin"), getDonors);
router.get("/receivers", protect, authorizeRoles("admin"), getReceivers);
router.get("/medicines", protect, authorizeRoles("admin"), getMedicines);
router.get("/reviews", protect, authorizeRoles("admin"), getReviews);
router.get("/profiles", protect, authorizeRoles("admin"), getProfiles);
router.get("/stats", protect, authorizeRoles("admin"), getStats);

// User management routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.post("/users", protect, authorizeRoles("admin"), addUser);
router.put("/users/:id", protect, authorizeRoles("admin"), editUser);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
