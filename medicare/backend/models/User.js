import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true },
phone: { type: String, required: true, unique: true },
password: { type: String, required: true, minlength: 6 },
role: { type: String, enum: ["donor", "receiver", "admin"] }, // Removed default
profilePicture: { type: String },
isVerified: { type: Boolean, default: false }, // after OTP verification
otp: { type: String }, // For storing OTP
otpExpiration: { type: Date }, // For OTP expiry
resetPasswordToken: { type: String },
resetPasswordExpires: { type: Date },
donorProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
receiverProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Receiver" },
},
{ timestamps: true }
);


// Hash password before save
userSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});


// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
return bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model("User", userSchema);