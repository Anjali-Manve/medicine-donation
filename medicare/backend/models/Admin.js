import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, enum: ["admin"], default: "admin" },
      isVerified: Boolean,
});

export default mongoose.model('Admin', adminSchema);