import mongoose from "mongoose";


const medicineSchema = new mongoose.Schema(
{
name: { type: String, required: true },
expiry: { type: Date, required: true },
quantity: { type: Number, required: true, min: 1 },
donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Receiver" },
status: { type: String, enum: ["available", "requested", "approved", "received"], default: "available" },
requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Receiver", default: null },
},
{ timestamps: true }
);



export default mongoose.model("Medicine", medicineSchema);