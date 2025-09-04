// mini project 5

import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cors from "cors";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());              // allow requests from frontend
app.use(express.json());      // parse JSON bodies

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Verify SMTP connection
transporter.verify((err, success) => {
    if (err) console.log("❌ SMTP Error:", err);
    else console.log("✅ Ready to send emails");
});

// Contact route
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Mail options
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.GMAIL_USER, // send to yourself
            subject: `📩 New Contact Form Message from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Email sent successfully ✅" });
    } catch (error) {
        console.error("❌ Error sending mail:", error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
