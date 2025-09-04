// 1) Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();  
// 👉 dotenv reads the `.env` file in your project and injects the key/values into process.env
//    Example: GMAIL_USER=abc@gmail.com → process.env.GMAIL_USER = "abc@gmail.com"
//    This way we don’t hard-code passwords inside the code.

// 2) Import nodemailer
import nodemailer from 'nodemailer';
// 👉 Nodemailer is the library that handles SMTP connections (sending emails).
//    It knows how to “speak” to mail servers like Gmail, Outlook, Yahoo etc.


// 3) Create a transporter (mail pipeline)
const transporter = nodemailer.createTransport({
  service: 'gmail',   // 👉 Use Gmail’s preconfigured SMTP settings.
  auth: {
    user: process.env.GMAIL_USER,        // 👉 Gmail address (sender)
    pass: process.env.GMAIL_APP_PASSWORD // 👉 16-char App Password, not your real password
  }
});

// 👉 The transporter object represents a "connection" to Gmail’s SMTP server.
//    You’ll use this transporter to actually send emails.


// 4) Verify the connection (optional but useful for testing)
transporter.verify(function (error, success) {
  if (error) console.log("❌ Error with SMTP connection:", error);
  else console.log("✅ Server is ready to take our messages");
});

// 👉 Nodemailer checks if Gmail SMTP accepts our login credentials and TLS connection.
//    If this passes, we know sending will work.
//    If it fails, you'll see errors like: EAUTH (bad password), ETIMEDOUT (network issue).


// 5) Define the email itself (mail options)
const mailOptions = {
  from: `My App <${process.env.GMAIL_USER}>`, // 👉 "From" header, shows sender name + email
  to: process.env.GMAIL_USER,                 // 👉 Recipient(s). Here you’re sending to yourself.
  subject: 'Hello World from Nodemailer 1',   // 👉 Email subject line
  text: 'This is my first mini project using Nodemailer 🎉' // 👉 Email body (plain text)
};

// 👉 This object describes the content of the email.
//    Later, you can add fields like html, cc, bcc, attachments, etc.


// 6) Actually send the email
transporter.sendMail(mailOptions, (err, info) => {
  if (err) return console.log("❌ Error while sending:", err);

  console.log("✅ Email sent successfully!");
  console.log("Message ID:", info.messageId);
});

// 👉 sendMail() tells Nodemailer to deliver the message through Gmail SMTP.
//    If it succeeds, Gmail accepts it into their system and gives a messageId.
//    After that, Gmail is responsible for delivering it to the recipient’s inbox.
//    (Sometimes it may land in Spam for simple test messages).




