import Medicine from "../models/Medicine.js";
import Donor from "../models/Donor.js";
import Receiver from "../models/Receiver.js";

// ✅ Get all medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .populate({ path: "donor", populate: { path: "user", select: "name email" } })
      .populate({ path: "receiver", populate: { path: "user", select: "name email" } })
      .populate({ path: "requestedBy", populate: { path: "user", select: "name email" } });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
};

// ✅ Get medicines for the logged-in donor
export const getDonorMedicines = async (req, res) => {
  try {
    if (!req.profileId) return res.status(400).json({ message: "Donor profile not found" });
    const medicines = await Medicine.find({ donor: req.profileId })
      .populate({ path: "donor", populate: { path: "user", select: "name email" } })
      .populate({ path: "requestedBy", populate: { path: "user", select: "name email" } })
      .populate({ path: "receiver", populate: { path: "user", select: "name email" } });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donor medicines" });
  }
};

// ✅ Donor add medicine
export const addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiry, expiryDate } = req.body;

    // Explicitly create a Date object to ensure Mongoose parses it correctly
    const parsedExpiryDate = new Date(expiry || expiryDate);

    if (!req.profileId) return res.status(400).json({ message: "Donor profile not found" });

    const medicine = await Medicine.create({
      name,
      quantity,
      expiry: parsedExpiryDate, // Use the parsed Date object
      donor: req.profileId,
    });

    // Donor profile me add kare
    await Donor.findByIdAndUpdate(req.profileId, {
      $push: { medicinesDonated: medicine._id },
    });

    res.status(201).json(medicine);
  } catch (error) {
    console.error("Error adding medicine:", error); // Ensure full error object is logged
    res.status(500).json({ message: "Error adding medicine" });
  }
};

// ✅ Receiver requests a medicine
export const requestMedicine = async (req, res) => {
  try {
    const { id } = req.params; // Medicine ID
    if (!req.profileId) return res.status(400).json({ message: "Receiver profile not found" });

    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    if (medicine.status !== "available") return res.status(400).json({ message: "Medicine not available for request" });

    medicine.status = "requested";
    medicine.requestedBy = req.profileId;
    await medicine.save();

    // Optionally, push this request to the donor's profile (if you have such a field like requestsReceived)
    // await Donor.findByIdAndUpdate(medicine.donor, { $push: { requestsReceived: medicine._id } });

    res.json({ message: "Medicine requested successfully", medicine });
  } catch (error) {
    console.error("Error requesting medicine:", error);
    res.status(500).json({ message: "Error requesting medicine" });
  }
};

// ✅ Donor approves a medicine request
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params; // Medicine ID
    if (!req.profileId) return res.status(400).json({ message: "Donor profile not found" });

    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    if (medicine.donor.toString() !== req.profileId.toString()) return res.status(403).json({ message: "Not authorized to approve this request" });
    if (medicine.status !== "requested") return res.status(400).json({ message: "Medicine is not in requested status" });

    medicine.status = "approved";
    // Set the actual receiver to the requestedBy user
    medicine.receiver = medicine.requestedBy;
    await medicine.save();

    res.json({ message: "Medicine request approved", medicine });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Error approving request" });
  }
};

// ✅ Donor rejects a medicine request
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params; // Medicine ID
    if (!req.profileId) return res.status(400).json({ message: "Donor profile not found" });

    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    if (medicine.donor.toString() !== req.profileId.toString()) return res.status(403).json({ message: "Not authorized to reject this request" });
    if (medicine.status !== "requested") return res.status(400).json({ message: "Medicine is not in requested status" });

    medicine.status = "available"; // Make it available again
    medicine.requestedBy = null; // Clear the requestedBy field
    await medicine.save();

    res.json({ message: "Medicine request rejected", medicine });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Error rejecting request" });
  }
};

// ✅ Receiver confirms receipt of medicine
export const receiveMedicine = async (req, res) => {
  try {
    const { id } = req.params; // Medicine ID
    if (!req.profileId) return res.status(400).json({ message: "Receiver profile not found" });

    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    // Ensure the receiver confirming is the one it was approved for
    if (!medicine.receiver || medicine.receiver.toString() !== req.profileId.toString()) {
      return res.status(403).json({ message: "Not authorized to confirm receipt for this medicine" });
    }
    if (medicine.status !== "approved") return res.status(400).json({ message: "Medicine is not in approved status" });

    medicine.status = "received";
    await medicine.save();

    res.json({ message: "Medicine received successfully", medicine });
  } catch (error) {
    console.error("Error confirming medicine receipt:", error);
    res.status(500).json({ message: "Error confirming medicine receipt" });
  }
};

// ✅ Delete medicine (only donor/admin)
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    // sirf donor khud ka medicine delete kar sakta hai
    if (
      req.user.role !== "admin" &&
      medicine.donor.toString() !== (req.profileId || "").toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await medicine.deleteOne();
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medicine" });
  }
};
