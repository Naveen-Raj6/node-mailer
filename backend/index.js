import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Dummy database (array to store users)
const users = [];

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Email template function
function generateWelcomeTemplate(name) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>🎉 Welcome, ${name}!</h2>
      <p>We’re so glad you signed up 🚀</p>
      <p>Explore our app and let us know your feedback.</p>
      <p>Cheers,<br/>The Team</p>
    </div>
  `;
}

// Signup API
app.post("/signup", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Name & Email required" });
  }

  // Save user in dummy DB
  users.push({ name, email });

  try {
    const mailOptions = {
      from: `My App <${process.env.GMAIL_USER}>`,
      to: email, // send email to user
      subject: `Welcome, ${name}! 🎉`,
      html: generateWelcomeTemplate(name),
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Signup successful, welcome email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Email sending failed" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
