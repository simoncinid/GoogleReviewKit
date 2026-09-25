import {
  createWidgetFromDraft,
  getEntitlementBySession,
  markEntitlementPaid,
  parseDraft,
  type WidgetDraft,
} from "../../../../lib/commerce";
import { readEnv, stripeGet } from "../../../../lib/stripe";

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

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return reply({ error: "Setup is only available on GoogleReviewsKit." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Expected a setup request." }, 415);

  let sessionId = "";
  let draft: WidgetDraft | null = null;
  try {
    const body = (await request.json()) as {
      session_id?: string;
      draft?: Partial<WidgetDraft>;
    };
    sessionId = typeof body.session_id === "string" ? body.session_id.trim() : "";
    if (body.draft) draft = parseDraft(JSON.stringify(body.draft));
  } catch {
    return reply({ error: "Invalid setup request." }, 400);
  }

  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId))
    return reply({ error: "Missing checkout session." }, 400);
  if (!draft)
    return reply({ error: "Select your business to finish setup." }, 400);

  const secret = await readEnv("STRIPE_SECRET_KEY");
  if (!secret)
    return reply({ error: "Checkout is not configured yet." }, 503);

  const { ok, data } = await stripeGet(
    `checkout/sessions/${encodeURIComponent(sessionId)}`,
    secret,
  );
  if (!ok || (String(data.payment_status) !== "paid" && String(data.status) !== "complete"))
    return reply({ error: "Payment is not complete yet." }, 402);

  const meta = (data.metadata || {}) as Record<string, string>;
  let entitlement = await markEntitlementPaid({
    entitlementId: meta.entitlement_id,
    sessionId,
    customerEmail:
      typeof data.customer_email === "string" ? data.customer_email : null,
  });
  if (!entitlement) entitlement = await getEntitlementBySession(sessionId);
  if (!entitlement || entitlement.status !== "paid")
    return reply({ error: "Paid order not found." }, 404);

  if (entitlement.widgetId)
    return reply({ widgetId: entitlement.widgetId });

  const widgetId = await createWidgetFromDraft(entitlement.id, draft);
  return reply({ widgetId });
}
