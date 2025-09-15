import express from "express";
import {
  getMedicines,
  addMedicine,
  requestMedicine,
  deleteMedicine,
  getDonorMedicines,
  approveRequest,
  rejectRequest,
  receiveMedicine,
} from "../controllers/medicineController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin can see all medicines
router.get("/", getMedicines);

// Donor can see their own medicines
router.get("/my-medicines", protect, authorizeRoles("donor"), getDonorMedicines);

// Donor add medicine
router.post("/", protect, authorizeRoles("donor"), addMedicine);

// Receiver request medicine
router.post("/request/:id", protect, authorizeRoles("receiver"), requestMedicine);

// Donor approves/rejects receiver request
router.post("/:id/approve", protect, authorizeRoles("donor"), approveRequest);
router.post("/:id/reject", protect, authorizeRoles("donor"), rejectRequest);

// Receiver confirms medicine received
router.post("/:id/receive", protect, authorizeRoles("receiver"), receiveMedicine);

// Donor/Admin delete medicine
router.delete("/:id", protect, authorizeRoles("donor", "admin"), deleteMedicine);

export default router;
