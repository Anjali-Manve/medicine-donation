import mongoose from "mongoose";


const profileSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
address: { type: String },
age: { type: Number },
gender: { type: String, enum: ["male", "female", "other"] },
bio: { type: String },
profilePicture: { type: String },
},
{ timestamps: true }
);


export default mongoose.model("Profile", profileSchema);