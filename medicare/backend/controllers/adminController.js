import Donor from "../models/Donor.js";
import Receiver from "../models/Receiver.js";
import Medicine from "../models/Medicine.js";
import Review from "../models/Review.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ✅ Get all donors
export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find().populate("medicines");
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donors" });
  }
};

// ✅ Get all receivers
export const getReceivers = async (req, res) => {
  try {
    const receivers = await Receiver.find().populate("medicines");
    res.json(receivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching receivers" });
  }
};

// ✅ Get all medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .populate("donor", "name email")
      .populate("receiver", "name email");
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
};

// ✅ Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// ✅ Get all profiles
// Get admin dashboard statistics
export const getStats = async (req, res) => {
  try {
    const [donors, receivers, medicines, reviews, users] = await Promise.all([
      Donor.countDocuments(),
      Receiver.countDocuments(),
      Medicine.countDocuments(),
      Review.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      donors,
      receivers,
      medicines,
      reviews,
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name email role");
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles" });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiration -resetPasswordToken -resetPasswordExpires")
      .populate("donorProfile", "name email phone")
      .populate("receiverProfile", "name email phone");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ Add new user
export const addUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role,
      isVerified: true, // Admin created users are automatically verified
    });

    await newUser.save();

    // Create Donor or Receiver profile based on role
    if (role === "donor") {
      const newDonor = new Donor({ user: newUser._id });
      await newDonor.save();
      newUser.donorProfile = newDonor._id;
    } else if (role === "receiver") {
      const newReceiver = new Receiver({ user: newUser._id });
      await newReceiver.save();
      newUser.receiverProfile = newReceiver._id;
    }

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// ✅ Edit user
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    // Update user fields
    user.name = name;
    user.email = email;
    user.phone = phone;

    // If role is being changed, handle profile updates
    if (role !== user.role) {
      // Remove old profile
      if (user.role === "donor" && user.donorProfile) {
        await Donor.findByIdAndDelete(user.donorProfile);
        user.donorProfile = null;
      } else if (user.role === "receiver" && user.receiverProfile) {
        await Receiver.findByIdAndDelete(user.receiverProfile);
        user.receiverProfile = null;
      }

      // Create new profile
      if (role === "donor") {
        const newDonor = new Donor({ user: user._id });
        await newDonor.save();
        user.donorProfile = newDonor._id;
      } else if (role === "receiver") {
        const newReceiver = new Receiver({ user: user._id });
        await newReceiver.save();
        user.receiverProfile = newReceiver._id;
      }

      user.role = role;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated profiles
    if (user.donorProfile) {
      await Donor.findByIdAndDelete(user.donorProfile);
    }
    if (user.receiverProfile) {
      await Receiver.findByIdAndDelete(user.receiverProfile);
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};