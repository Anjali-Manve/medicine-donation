import Donor from "../models/Donor.js";
import Medicine from "../models/Medicine.js";

// ✅ Get all donors
export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find().populate("medicines");
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donors" });
  }
};

// ✅ Create new donor
export const createDonor = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const donor = await Donor.create({ name, email, phone });
    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: "Error creating donor" });
  }
};

// ✅ Update donor
export const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: "Error updating donor" });
  }
};

// ✅ Delete donor
export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting donor" });
  }
};
