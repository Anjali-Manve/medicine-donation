import mongoose from "mongoose";


const donorSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
medicinesDonated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
association: { type: String }, // e.g., NGO, group
},
{ timestamps: true }
);

export default mongoose.model("Donor", donorSchema);