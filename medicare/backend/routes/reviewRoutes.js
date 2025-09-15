import express from "express";
import { addReview, getReviews,getAllReviews  } from "../controllers/reviewController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Receiver add review
router.post("/", protect, addReview);

// Get donor reviews
router.get("/:donorId", protect, getReviews);
router.get("/", getAllReviews);


export default router;
