import express from "express";
import {
  getReceivers,
  createReceiver,
  updateReceiver,
  deleteReceiver,
} from "../controllers/receiverController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only admin can see all receivers
router.get("/", protect, authorizeRoles("admin"), getReceivers);

// Receiver can register himself
router.post("/", protect, authorizeRoles("receiver"), createReceiver);

// Receiver update/delete apna profile
router.put("/:id", protect, authorizeRoles("receiver"), updateReceiver);
router.delete("/:id", protect, authorizeRoles("receiver"), deleteReceiver);

export default router;
