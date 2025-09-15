import express from "express";
import {
  getDonors,
  createDonor,
  updateDonor,
  deleteDonor,
} from "../controllers/donorController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only admin can see all donors
router.get("/", protect, authorizeRoles("admin"), getDonors);

// Donor can register himself
router.post("/", protect, authorizeRoles("donor"), createDonor);

// Donor update/delete apna profile
router.put("/:id", protect, authorizeRoles("donor"), updateDonor);
router.delete("/:id", protect, authorizeRoles("donor"), deleteDonor);

export default router;
