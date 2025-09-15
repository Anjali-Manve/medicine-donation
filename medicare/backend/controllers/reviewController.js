import Review from "../models/Review.js";
import Donor from "../models/Donor.js";

// ✅ Add Review (Receiver → Donor)
export const addReview = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated or user ID missing." });
    }
    const { donorId, rating, comment } = req.body;

    if (!donorId) {
      return res.status(400).json({ message: "Donor ID is required to add a review." });
    }

    const review = await Review.create({
      donor: donorId,
      receiver: req.user._id,
      rating,
      comment,
    });

    // Donor ke reviews array me add kare
    await Donor.findByIdAndUpdate(donorId, {
      $push: { reviews: review._id },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error adding review" });
  }
};

// ✅ Get all reviews of a donor
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ donor: req.params.donorId }).populate(
      "receiver",
      "name email"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// 🔥 Get all or recent approved reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" }) // only approved ones
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10); // latest 10

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
