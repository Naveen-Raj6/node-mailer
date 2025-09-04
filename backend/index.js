// mini project 2

import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// console.log("Loaded Gmail:", process.env.GMAIL_USER);


// // 1) create transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // your App Password
  }
});

// // 2) verify connection
transporter.verify(function (error, success) {
  if (error) console.log("❌ Error with SMTP connection:", error);
  else console.log("✅ Server is ready to take our messages");
});

// // 3) define email options
const mailOptions = {
  from: `My App <${process.env.GMAIL_USER}>`, // sender name + email
  to: process.env.GMAIL_USER,                 // send to yourself
//   to:process.env.DUMMY_TO_MAIL,            // send to friends
  subject: 'Hello Styled Email from Nodemailer',
  text: 'This is a plain text fallback version of the email.',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4CAF50;">🎉 Welcome to Mini Project 2</h2>
      <p>This email is <b>HTML formatted</b> with inline CSS.</p>
      <p>Here’s a link: <a href="https://www.google.com">Google</a></p>
      <hr/>
      <footer style="font-size: 12px; color: gray;">
        Sent with 😊 using Nodemailer
      </footer>
    </div>
  `
};

// // 4) send the email
transporter.sendMail(mailOptions, (err, info) => {
  if (err) return console.log("❌ Error while sending:", err);
  console.log("✅ Email sent successfully!");
  console.log("Message ID:", info.messageId);
});

