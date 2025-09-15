import nodemailer from "nodemailer";

// Store OTPs in memory (for demo; use Redis/DB in production)
const otpStore = new Map();

// ✅ Generate OTP
export function generateOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // expires in 5 min
  return otp;
}

// ✅ Verify OTP
export function verifyOtp(email, enteredOtp) {
  const record = otpStore.get(email);
  if (!record) return false;

  const { otp, expiresAt } = record;

  // Expired
  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return false;
  }

  // Match
  if (otp === enteredOtp) {
    otpStore.delete(email);
    return true;
  }

  return false;
}

// ✅ Send OTP via email
export async function sendOtpEmail(email, otp) {
  // TEMPORARY: Skip email sending if credentials are not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`⚠️ Warning: Email credentials not set. OTP for ${email} would have been: ${otp}`);
    return; // Exit without attempting to send email
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can also use custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // your gmail address
        pass: process.env.EMAIL_PASS, // app password (not your Gmail password!)
      },
    });

    const mailOptions = {
      from: `"Medicine Donation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP email sent to ${email}`);
  } catch (err) {
    console.error("❌ Error sending OTP email:", err.message);
    throw new Error("Email could not be sent");
  }
}
