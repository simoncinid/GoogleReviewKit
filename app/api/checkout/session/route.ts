import {
  getEntitlementBySession,
  markEntitlementPaid,
  parseDraft,
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

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim();
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId))
    return reply({ error: "Missing checkout session." }, 400);

  const secret = await readEnv("STRIPE_SECRET_KEY");
  if (!secret)
    return reply({ error: "Checkout is not configured yet." }, 503);

  const { ok, data } = await stripeGet(
    `checkout/sessions/${encodeURIComponent(sessionId)}`,
    secret,
  );
  if (!ok)
    return reply(
      { error: data.error?.message || "Could not verify payment." },
      502,
    );

  const paymentStatus = String(data.payment_status || "");
  const status = String(data.status || "");
  if (paymentStatus !== "paid" && status !== "complete")
    return reply({ error: "Payment is not complete yet.", status: paymentStatus }, 402);

  const meta = (data.metadata || {}) as Record<string, string>;
  const entitlementId =
    meta.entitlement_id ||
    (typeof data.client_reference_id === "string"
      ? data.client_reference_id
      : undefined);

  let entitlement = await markEntitlementPaid({
    entitlementId,
    sessionId,
    customerId:
      typeof data.customer === "string"
        ? data.customer
        : ((data.customer as { id?: string } | null)?.id ?? null),
    customerEmail:
      typeof data.customer_email === "string"
        ? data.customer_email
        : typeof data.customer_details === "object" &&
            data.customer_details &&
            typeof (data.customer_details as { email?: string }).email ===
              "string"
          ? (data.customer_details as { email: string }).email
          : null,
  });

  if (!entitlement)
    entitlement = await getEntitlementBySession(sessionId);

  if (!entitlement)
    return reply(
      {
        error:
          "Payment succeeded but the order was not found. Contact support with your receipt.",
      },
      404,
    );

  return reply({
    entitlementId: entitlement.id,
    plan: entitlement.plan,
    status: entitlement.status,
    widgetId: entitlement.widgetId,
    hasDraft: !!parseDraft(entitlement.draftJson),
    email: entitlement.customerEmail,
    flow: entitlement.widgetId
      ? "install"
      : parseDraft(entitlement.draftJson)
        ? "install"
        : "setup",
  });
}
