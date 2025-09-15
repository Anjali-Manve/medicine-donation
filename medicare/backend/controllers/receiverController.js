import Receiver from "../models/Receiver.js";
import Medicine from "../models/Medicine.js";

// ✅ Get all receivers
export const getReceivers = async (req, res) => {
  try {
    const receivers = await Receiver.find().populate("medicines");
    res.json(receivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching receivers" });
  }
};

// ✅ Create new receiver
export const createReceiver = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const receiver = await Receiver.create({ name, email, phone });
    res.status(201).json(receiver);
  } catch (error) {
    res.status(500).json({ message: "Error creating receiver" });
  }
};

// ✅ Update receiver
export const updateReceiver = async (req, res) => {
  try {
    const receiver = await Receiver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });
    res.json(receiver);
  } catch (error) {
    res.status(500).json({ message: "Error updating receiver" });
  }
};

// ✅ Delete receiver
export const deleteReceiver = async (req, res) => {
  try {
    const receiver = await Receiver.findByIdAndDelete(req.params.id);
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });
    res.json({ message: "Receiver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting receiver" });
  }
};
