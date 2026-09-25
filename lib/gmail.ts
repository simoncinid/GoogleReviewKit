import nodemailer from "nodemailer";
import { readEnv } from "./stripe";

export type WaitlistLead = {
  email: string;
  phone: string;
  website: string;
  source: string;
};

/** Send a plain-text alert via Gmail SMTP (app password). Nothing is stored. */
export async function sendWaitlistEmail(lead: WaitlistLead) {
  const sender = await readEnv("SENDER_ADDRESS");
  const passwordRaw = await readEnv("GMAIL_APP_PASSWORD");
  const dest = await readEnv("DEST_ADDRESS");
  if (!sender || !passwordRaw || !dest) {
    throw new Error("Waitlist email is not configured.");
  }
  const password = passwordRaw.replace(/\s+/g, "");

  const text = [
    "New GoogleReviewsKit waitlist signup",
    "",
    `Email: ${lead.email || "—"}`,
    `Phone: ${lead.phone || "—"}`,
    `Website: ${lead.website || "—"}`,
    `Source: ${lead.source}`,
    `When: ${new Date().toISOString()}`,
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: sender, pass: password },
  });

  await transporter.sendMail({
    from: sender,
    to: dest,
    replyTo: lead.email || undefined,
    subject: "Waitlist signup — GoogleReviewsKit",
    text,
  });
}
