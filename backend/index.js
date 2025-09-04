import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory store for tokens (⚠️ later replace with DB)
const tokens = new Map();

// 1) Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// 2) Signup route → generate token + send verification email
app.post("/signup", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // generate token
  const token = crypto.randomBytes(20).toString("hex");
  tokens.set(token, email);

  // email link
  const verifyUrl = `http://localhost:5000/verify/${token}`;

  const mailOptions = {
    from: `"My App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Hello ${name || "User"},</h2>
      <p>Please click below to verify your email:</p>
      <a href="${verifyUrl}" target="_blank">Verify Email</a>
      <p>This link is valid for one-time use only.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification email sent!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// 3) Verify route → check token + redirect to frontend
app.get("/verify/:token", (req, res) => {
  const { token } = req.params;
  const email = tokens.get(token);

  if (!email) {
    // token invalid → redirect with failure
    return res.redirect("http://localhost:5173/verified?success=false");
  }

  // token valid → consume it
  tokens.delete(token);
  console.log(`✅ ${email} verified successfully!`);

  // redirect to frontend with success
  res.redirect("http://localhost:5173/verified?success=true");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


