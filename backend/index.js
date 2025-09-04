// mini project 4

import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// 1) create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});


// 2) verify connection
transporter.verify(function (error, success) {
  if (error) console.log("❌ Error with SMTP connection:", error);
  else console.log("✅ Server is ready to take our messages");
});


// 3) template function
function generateWelcomeTemplate(username) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>👋 Welcome, ${username}!</h2>
      <p>We’re excited to have you on board 🚀</p>
      <p>Click below to verify your email:</p>
      <a href="https://example.com/verify?user=${username}"
         style="display:inline-block; padding:10px 20px; background:#007bff; 
                color:white; text-decoration:none; border-radius:5px;">
         Verify Email
      </a>
      <br/><br/>
      <p style="font-size:12px; color:#666;">If you didn’t sign up, ignore this email.</p>
    </div>
  `;
}


// 4) API route to send dynamic email
app.post("/send-welcome", (req, res) => {
  const { username, toEmail } = req.body; // ⬅️ frontend will send this

  if (!username || !toEmail) {
    return res.status(400).json({ error: "Username and toEmail are required" });
  }

  const mailOptions = {
    from: `My App <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome, ${username}! 🎉 to 4th mini project`,
    html: generateWelcomeTemplate(username)
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("❌ Error while sending:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }
    console.log("✅ Email sent successfully!", info.messageId);
    res.json({ success: true, messageId: info.messageId });
  });
});


// 5) start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));

