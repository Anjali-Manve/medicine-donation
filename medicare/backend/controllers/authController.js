import User from "../models/User.js";
import Donor from "../models/Donor.js"; // Add Donor model import
import Receiver from "../models/Receiver.js"; // Add Receiver model import
import Admin from "../models/Admin.js"; // Add Admin model import
import sendEmail from "../utils/sendEmail.js"; // Corrected typo here

import bcrypt from "bcrypt"; // Keep bcrypt for password hashing in User model

// Your existing generateToken import (assuming it's still needed for login later)
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

export const sendOtp = async (req, res) => {
  const { name, email, phone, password, role } = req.body; // Added phone based on previous discussion

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      // If user exists and is verified, they should log in
      if (user.isVerified) {
        return res
          .status(409)
          .json({ message: "User already exists. Please login." });
      }
      // If user exists but not verified, update their details and prepare for re-verification
      user.name = name;
      user.password = password; // Hashing will be done in the User model pre-save hook
      user.role = role;
      user.phone = phone; // Update phone
    } else {
      // Create a new temporary user
      user = new User({ name, email, phone, password, role });
    }

    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

    
    await user.save();

    // Send OTP via email
    const emailSubject = "MediCare: OTP for Email Verification";
    const emailText = `Your 6-digit OTP for MediCare is: ${otp}. This OTP is valid for 15 minutes.`;
    await sendEmail(email, emailSubject, emailText);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify your account.",
      userId: user._id, // Return userId for frontend to use in verify step
      email: user.email // Return email for frontend to use in verify step
    });
  } catch (error) {
    console.error("sendOtp error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error sending OTP. Please try again later.",
    });
  }
};

// This function handles OTP verification and final registration
export const verifyAndRegister = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if OTP has expired
    if (user.otpExpiration < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check your OTP and try again.",
      });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;

    // Create Donor or Receiver profile based on role
    if (user.role === "donor") {
      const newDonor = new Donor({ user: user._id });
      await newDonor.save();
      user.donorProfile = newDonor._id; // Link Donor profile to User
    } else if (user.role === "receiver") {
      const newReceiver = new Receiver({ user: user._id });
      await newReceiver.save();
      user.receiverProfile = newReceiver._id; // Link Receiver profile to User
    }

    await user.save();
    const token = generateToken(user._id);  // Save user again to persist profile link

    res.status(200).json({
      success: true,
      message: "Email verified and account created successfully!",  token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("verifyAndRegister error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error verifying OTP and creating account.",
    });
  }
};

// Your existing loginUser function (assuming it's still needed)
// import generateToken from "../utils/generateToken.js"; // make sure this is imported if used
export const loginUser = async (req, res) => {
  try {
    const rawEmail = (req.body?.email || "").toString();
    const rawPassword = (req.body?.password || "").toString();

    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const email = rawEmail.trim().toLowerCase();
    const password = rawPassword; // do not trim password

    // 1. Find user (normalize email)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // 2. Match password
    let isMatch = false;
    try {
      isMatch = await user.comparePassword(password);
    } catch (_) {
      isMatch = false;
    }

    // Fallback for legacy/plaintext passwords (if any exist)
    if (!isMatch) {
      const looksHashed = typeof user.password === "string" && user.password.startsWith("$2b$");
      if (!looksHashed && user.password === password) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // 3. Check verification
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: "Please verify OTP before login" });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return     res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- ADMIN LOGIN --------------------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if admin exists in User collection with admin role
    const adminUser = await User.findOne({ email: email.trim().toLowerCase(), role: "admin" });

    if (!adminUser) {
      // If not found in User collection, check Admin collection
      const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
      if (!admin) {
        return res.status(400).json({ success: false, message: "Invalid admin credentials" });
      }

      // Verify password for Admin model
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid admin credentials" });
      }

      // Generate JWT token
      const token = generateToken(admin._id);

      return res.json({
        success: true,
        message: "Admin login successful",
        token,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isVerified: admin.isVerified,
        },
      });
    }

    // If admin found in User collection, verify password
    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }

    // Check verification
    if (!adminUser.isVerified) {
      return res.status(401).json({ success: false, message: "Please verify admin account before login" });
    }

    // Generate JWT token
    const token = generateToken(adminUser._id);

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        isVerified: adminUser.isVerified,
      },
    });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ success: true, message: "If that email exists, we sent reset link" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    const subject = "MediCare: Reset your password";
    const text = `Click the link to reset your password: ${resetUrl}`;
    await sendEmail(user.email, subject, text);

    res.json({ success: true, message: "Password reset link sent to email" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: "Token invalid or expired" });

    user.password = password; // will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
