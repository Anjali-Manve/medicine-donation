import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
rating: { type: Number, min: 1, max: 5, required: true },
comment: { type: String, trim: true },
isApproved: { type: Boolean, default: false },
},
{ timestamps: true }
);


export default mongoose.model("Review", reviewSchema);