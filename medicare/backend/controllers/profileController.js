// import Donor from "../models/Donor.js";
// import Receiver from "../models/Receiver.js";

// // ✅ Get logged-in user profile
// export const getProfile = async (req, res) => {
//   try {
//     let profile;
//     if (req.user.role === "donor") {
//       profile = await Donor.findById(req.user._id).populate("medicines reviews");
//     } else if (req.user.role === "receiver") {
//       profile = await Receiver.findById(req.user._id).populate("medicines");
//     } else {
//       return res.status(400).json({ message: "Invalid role" });
//     }
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching profile" });
//   }
// };

// // ✅ Update profile
// export const updateProfile = async (req, res) => {
//   try {
//     const { name, phone } = req.body;

//     let updatedProfile;
//     if (req.user.role === "donor") {
//       updatedProfile = await Donor.findByIdAndUpdate(
//         req.user._id,
//         { name, phone },
//         { new: true }
//       );
//     } else if (req.user.role === "receiver") {
//       updatedProfile = await Receiver.findByIdAndUpdate(
//         req.user._id,
//         { name, phone },
//         { new: true }
//       );
//     }

//     res.json(updatedProfile);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile" });
//   }
// };
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    res.json({ message: "Profile picture uploaded", profilePicture: user.profilePicture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
