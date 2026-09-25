import { sendWaitlistEmail } from "../../../lib/gmail";

function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const reqOrigin = new URL(request.url).origin;
  if (origin && origin !== reqOrigin) return false;
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  return true;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function validPhone(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  const digitCount = digits.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15 && digits.length <= 24;
}

function normalizeWebsite(value: string) {
  if (!value) return "";
  const trimmed = value.trim().slice(0, 300);
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return reply({ error: "Waitlist is only available on GoogleReviewsKit." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Expected a waitlist request." }, 415);

  let email = "";
  let phone = "";
  let website = "";
  let source = "pre-release";
  try {
    const body = (await request.json()) as {
      email?: string;
      phone?: string;
      website?: string;
      source?: string;
    };
    email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    phone = typeof body.phone === "string" ? body.phone.trim() : "";
    website =
      typeof body.website === "string" ? body.website.trim().slice(0, 300) : "";
    if (typeof body.source === "string" && body.source.trim()) {
      source = body.source.trim().slice(0, 64);
    }
  } catch {
    return reply({ error: "Enter email or phone, and try again." }, 400);
  }

  if (email && !validEmail(email))
    return reply({ error: "Enter a valid email address." }, 400);
  if (phone && !validPhone(phone))
    return reply({ error: "Enter a valid phone number." }, 400);
  if (!email && !phone)
    return reply({ error: "Email or phone is required." }, 400);

  try {
    await sendWaitlistEmail({
      email,
      phone,
      website: normalizeWebsite(website),
      source,
    });
  } catch {
    return reply(
      { error: "Could not send your signup. Please try again in a moment." },
      502,
    );
  }

  return reply({ ok: true, discount: "20%" });
}
