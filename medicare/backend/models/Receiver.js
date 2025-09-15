import mongoose from "mongoose";


const receiverSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
medicinesRequested: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
association: { type: String },
},
{ timestamps: true }
);


export default mongoose.model("Receiver", receiverSchema);