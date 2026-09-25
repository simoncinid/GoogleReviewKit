import { readEnv } from "./stripe";

export type WaitlistLead = {
  email: string;
  phone: string;
  website: string;
  source: string;
};

function encodeBase64(value: string) {
  // Avoid Buffer for Workers portability.
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

async function smtpExpect(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  state: { buf: string },
  code: string,
) {
  const decoder = new TextDecoder();
  while (true) {
    const end = state.buf.indexOf("\r\n");
    if (end === -1) {
      const { value, done } = await reader.read();
      if (done) throw new Error("SMTP connection closed unexpectedly.");
      state.buf += decoder.decode(value, { stream: true });
      continue;
    }
    const line = state.buf.slice(0, end);
    state.buf = state.buf.slice(end + 2);
    // Multi-line replies end when the code is followed by a space.
    if (/^\d{3}-/.test(line)) continue;
    if (!line.startsWith(code)) {
      throw new Error(`SMTP expected ${code}, got: ${line}`);
    }
    return line;
  }
}

async function smtpCmd(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  reader: ReadableStreamDefaultReader<Uint8Array>,
  state: { buf: string },
  line: string,
  code: string,
) {
  await writer.write(new TextEncoder().encode(`${line}\r\n`));
  return smtpExpect(reader, state, code);
}

/** Send a plain-text alert via Gmail SMTP (app password). Nothing is stored. */
export async function sendWaitlistEmail(lead: WaitlistLead) {
  const sender = await readEnv("SENDER_ADDRESS");
  const passwordRaw = await readEnv("GMAIL_APP_PASSWORD");
  const dest = await readEnv("DEST_ADDRESS");
  if (!sender || !passwordRaw || !dest) {
    throw new Error("Waitlist email is not configured.");
  }
  const password = passwordRaw.replace(/\s+/g, "");

  const lines = [
    "New GoogleReviewsKit waitlist signup",
    "",
    `Email: ${lead.email || "—"}`,
    `Phone: ${lead.phone || "—"}`,
    `Website: ${lead.website || "—"}`,
    `Source: ${lead.source}`,
    `When: ${new Date().toISOString()}`,
  ];
  const text = lines.join("\n");
  const replyTo = lead.email || undefined;
  const subject = "Waitlist signup — GoogleReviewsKit";

  const { connect } = await import("cloudflare:sockets");
  const socket = connect(
    { hostname: "smtp.gmail.com", port: 465 },
    { secureTransport: "on" },
  );
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const state = { buf: "" };

  try {
    await smtpExpect(reader, state, "220");
    await smtpCmd(writer, reader, state, "EHLO googlereviewskit", "250");
    await smtpCmd(writer, reader, state, "AUTH LOGIN", "334");
    await smtpCmd(writer, reader, state, encodeBase64(sender), "334");
    await smtpCmd(writer, reader, state, encodeBase64(password), "235");
    await smtpCmd(writer, reader, state, `MAIL FROM:<${sender}>`, "250");
    await smtpCmd(writer, reader, state, `RCPT TO:<${dest}>`, "250");
    await smtpCmd(writer, reader, state, "DATA", "354");

    const payload = [
      `From: ${sender}`,
      `To: ${dest}`,
      replyTo ? `Reply-To: ${replyTo}` : null,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      text.replace(/\r?\n/g, "\r\n").replace(/^\./gm, ".."),
      ".",
    ]
      .filter((x) => x !== null)
      .join("\r\n");

    await writer.write(new TextEncoder().encode(`${payload}\r\n`));
    await smtpExpect(reader, state, "250");
    await smtpCmd(writer, reader, state, "QUIT", "221").catch(() => undefined);
  } finally {
    try {
      writer.releaseLock();
    } catch {}
    try {
      reader.releaseLock();
    } catch {}
    try {
      socket.close();
    } catch {}
  }
}
