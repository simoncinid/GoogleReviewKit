import {
  attachCheckoutSession,
  createEntitlement,
  parseDraft,
  type Plan,
  type WidgetDraft,
} from "../../../lib/commerce";
import { readEnv, stripeForm } from "../../../lib/stripe";

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
    return reply({ error: "Checkout is only available on GoogleReviewsKit." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Expected a checkout request." }, 415);

  let plan: Plan | undefined;
  let draft: WidgetDraft | null = null;
  try {
    const body = (await request.json()) as {
      plan?: string;
      draft?: Partial<WidgetDraft> | null;
    };
    if (body.plan === "founding" || body.plan === "monthly") plan = body.plan;
    if (body.draft && typeof body.draft === "object" && body.draft.placeId) {
      draft = parseDraft(JSON.stringify(body.draft));
    }
  } catch {
    return reply({ error: "Choose a plan to continue." }, 400);
  }
  if (!plan) return reply({ error: "Choose a plan to continue." }, 400);

  const secret = await readEnv("STRIPE_SECRET_KEY");
  const foundingSetup = await readEnv("STRIPE_PRICE_FOUNDING_SETUP");
  const foundingMonthly = await readEnv("STRIPE_PRICE_FOUNDING_MONTHLY");
  const monthlyOnly = await readEnv("STRIPE_PRICE_MONTHLY");

  if (!secret || !foundingSetup || !foundingMonthly || !monthlyOnly)
    return reply(
      { code: "NOT_CONFIGURED", error: "Checkout is not configured yet." },
      503,
    );

  let entitlementId: string;
  try {
    entitlementId = await createEntitlement({ plan, draft });
  } catch {
    return reply(
      {
        error:
          "Could not start checkout storage. Restart the local server and try again.",
      },
      503,
    );
  }

  const reqOrigin = new URL(request.url).origin;
  const successPath = draft ? "/install" : "/setup";
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set(
    "success_url",
    `${reqOrigin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
  );
  params.set("cancel_url", `${reqOrigin}/?checkout=cancel`);
  params.set("allow_promotion_codes", "true");
  params.set("billing_address_collection", "auto");
  params.set("managed_payments[enabled]", "false");
  params.set("client_reference_id", entitlementId);
  params.set("metadata[plan]", plan);
  params.set("metadata[entitlement_id]", entitlementId);
  params.set("metadata[flow]", draft ? "create_then_pay" : "pay_then_create");

  if (plan === "founding") {
    params.set("line_items[0][price]", foundingSetup);
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[1][price]", foundingMonthly);
    params.set("line_items[1][quantity]", "1");
  } else {
    params.set("line_items[0][price]", monthlyOnly);
    params.set("line_items[0][quantity]", "1");
  }

  const { ok, data } = await stripeForm("checkout/sessions", params, secret);
  const url = typeof data.url === "string" ? data.url : "";
  const sessionId = typeof data.id === "string" ? data.id : "";
  if (!ok || !url || !sessionId) {
    return reply(
      {
        error:
          data.error?.message || "Could not start checkout. Please try again.",
      },
      502,
    );
  }

  try {
    await attachCheckoutSession(entitlementId, sessionId);
  } catch {}

  return reply({ url, entitlementId });
}
