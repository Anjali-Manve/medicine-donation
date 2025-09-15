import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can also use custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // your gmail address
        pass: process.env.EMAIL_PASS, // app password (not your Gmail password!)
      },
    });

    const mailOptions = {
      from: `"MediCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email} with subject: ${subject}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    // To avoid crashing if email fails, we log and re-throw only if it's a critical setup issue
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials (EMAIL_USER or EMAIL_PASS) are not set in .env");
    }
    throw new Error(`Email could not be sent: ${err.message}`);
  }
};

export default sendEmail;
