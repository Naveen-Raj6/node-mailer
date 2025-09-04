// mini project 3

import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// // console.log("Loaded Gmail:", process.env.GMAIL_USER);


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
subject: 'Mini Project 3: Email with Attachments',
  text: 'This email contains attachments!',
  html: `
    <h2>📎 Check out the attachments below</h2>
    <p>We even added an inline image:</p>
    <img src="cid:uniqueImageId" width="300"/>
  `,
  attachments: [
    {
      filename: 'hello.txt',          // name shown in email
      content: 'Hello World from Nodemailer! mini project 3', // text file content
    },
    {
      filename: 'test.pdf',           // attach a real file from project folder
      path: 'C:/Users/Hp/Downloads/Songs.pdf'
    },
    {
      filename: 'image.png',          // inline image
      path: 'C:/Users/Hp/Downloads/Zoro.png',
      cid: 'uniqueImageId'            // same cid as used in <img src="">
    }
  ]
};

// // 4) send the email
transporter.sendMail(mailOptions, (err, info) => {
  if (err) return console.log("❌ Error while sending:", err);
  console.log("✅ Email sent successfully!");
  console.log("Message ID:", info.messageId);
});
