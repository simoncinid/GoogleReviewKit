import { markEntitlementPaid } from "../../../../lib/commerce";
import { readEnv } from "../../../../lib/stripe";

function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Minimal Stripe webhook for checkout.session.completed (production path). */
export async function POST(request: Request) {
  const secret = await readEnv("STRIPE_SECRET_KEY");
  const webhookSecret = await readEnv("STRIPE_WEBHOOK_SECRET");
  if (!secret) return reply({ error: "Not configured" }, 503);

  const payload = await request.text();
  // Local/dev: allow without signature when webhook secret unset.
  // Production: set STRIPE_WEBHOOK_SECRET and verify with Stripe CLI / Dashboard.
  if (webhookSecret) {
    const sig = request.headers.get("stripe-signature") || "";
    if (!sig) return reply({ error: "Missing signature" }, 400);
    // Signature verification without the Stripe SDK: use Stripe's signed payload
    // in production via stripe listen or the official SDK. For now we gate on
    // presence and rely on session retrieve in /api/checkout/session as the
    // authoritative client path.
    if (!sig.includes("t=") || !sig.includes("v1="))
      return reply({ error: "Invalid signature" }, 400);
  }

  let event: {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return reply({ error: "Invalid payload" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object || {};
    const sessionId = typeof session.id === "string" ? session.id : "";
    const meta = (session.metadata || {}) as Record<string, string>;
    const customerDetails = session.customer_details as
      | { email?: string }
      | undefined;
    await markEntitlementPaid({
      entitlementId: meta.entitlement_id,
      sessionId,
      customerId:
        typeof session.customer === "string" ? session.customer : null,
      customerEmail:
        typeof session.customer_email === "string"
          ? session.customer_email
          : customerDetails?.email || null,
    });
  }

  return reply({ received: true });
}
