import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cron from "node-cron";

dotenv.config();

const {
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  DEFAULT_TO = process.env.GMAIL_USER,
  PORT = 5000,
} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ SMTP verify failed:", err.message);
  else console.log("✅ SMTP ready to send");
});

// Fetch top 3 AI-related news stories from Hacker News (no key needed)
async function getAiTechNews() {
  const url = "https://hn.algolia.com/api/v1/search?query=AI OR technology&tags=story&hitsPerPage=5";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Hacker News API error: ${res.status}`);
  const data = await res.json();
  return (data.hits || [])
    .slice(0, 3)
    .map((n) => ({
      title: n.title || "Untitled story",
      url: n.url || `https://news.ycombinator.com/item?id=${n.objectID}`,
      author: n.author || "unknown",
    }));
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(newsItems) {
  const newsList = newsItems
    .map(
      (item, idx) => `
      <li style="margin: 8px 0;">
        <a href="${item.url}" style="text-decoration:none;font-weight:600;">
          ${idx + 1}. ${escapeHtml(item.title)}
        </a>
        <div style="font-size:12px;color:#666;">Author: ${escapeHtml(item.author)}</div>
      </li>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;padding:16px;color:#111;">
      <h2>Your Daily AI & Tech Digest</h2>
      <p>Here are the top tech/AI stories right now:</p>
      <ul style="padding-left:18px;">${newsList}</ul>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
      <div style="font-size:12px;color:#777;">
        Sent with Automated Digest • ${new Date().toLocaleString()}
      </div>
    </div>`;
}

async function sendNewsDigest(to = DEFAULT_TO) {
  const news = await getAiTechNews();
  const htmlBody = buildEmailHtml(news);

  const mailOptions = {
    from: `Tech Digest <${GMAIL_USER}>`,
    to,
    subject: "🚀 Your Daily AI & Tech News",
    html: htmlBody,
    text: [
      "Daily AI & Tech News",
      ...news.map((n, i) => `${i + 1}. ${n.title} — ${n.url}`),
    ].join("\n"),
  };

  const info = await transporter.sendMail(mailOptions);
  return info.messageId;
}

// Manual trigger endpoint
app.post("/send-digest", async (req, res) => {
  try {
    const id = await sendNewsDigest(req.body?.to || DEFAULT_TO);
    res.json({ success: true, messageId: id });
  } catch (err) {
    console.error("❌ Manual send failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get("/", (_req, res) => res.send("Tech digest backend running"));

// Schedule daily at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("⏰ Running scheduled digest...");
    const id = await sendNewsDigest(DEFAULT_TO);
    console.log("✅ Digest sent:", id);
  } catch (err) {
    console.error("❌ Scheduled digest failed:", err.message);
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
