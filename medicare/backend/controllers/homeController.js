import Donor from "../models/Donor.js";
import Receiver from "../models/Receiver.js";
import Review from "../models/Review.js";

// @desc    Get home page statistics
// @route   GET /api/home/stats
// @access  Public
export const getHomeStats = async (req, res) => {
  try {
    const [donorCount, receiverCount, reviewCount] = await Promise.all([
      Donor.countDocuments(),
      Receiver.countDocuments(),
      Review.countDocuments({ isApproved: true }) // Only count approved reviews
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDonors: donorCount,
        totalReceivers: receiverCount,
        totalApprovedReviews: reviewCount
      }
    });
  } catch (error) {
    console.error('Error getting home stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};
