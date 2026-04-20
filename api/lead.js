import nodemailer from "nodemailer";
import { profile } from "../src/data/profile.js";

function normalize(value = "") {
  return String(value).trim();
}

function parseRequestBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body || "{}");
    } catch {
      return {};
    }
  }

  return body || {};
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = parseRequestBody(req.body);
  const name = normalize(body.name);
  const email = normalize(body.email);
  const phone = normalize(body.phone);
  const company = normalize(body.company);
  const message = normalize(body.message);

  if (!name || !email || !phone) {
    return res.status(400).json({
      error: "Name, email, and phone are required to unlock direct phone contact.",
    });
  }

  const transporter = createTransport();

  if (!transporter) {
    return res.status(500).json({
      error:
        "Lead email delivery is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in environment variables.",
    });
  }

  const to = process.env.LEAD_INBOX_EMAIL || profile.email;
  const from = process.env.LEAD_FROM_EMAIL || process.env.SMTP_USER || to;
  const subject = `New profile inquiry: ${name}`;

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Company: ${company || "Not provided"}`,
    `Message: ${message || "Not provided"}`,
    "",
    "Source: Profile collaboration intake form",
    `Time: ${new Date().toISOString()}`,
  ];

  const text = lines.join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Profile Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || "Not provided"}</p>
      <p><strong>Message:</strong> ${message || "Not provided"}</p>
      <p><strong>Source:</strong> Profile collaboration intake form</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      to,
      from,
      replyTo: email,
      subject,
      text,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Lead email could not be sent.",
    });
  }
}
