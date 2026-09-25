import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { entitlements, widgets } from "../db/schema";

export type Plan = "founding" | "monthly";

export type WidgetDraft = {
  placeId: string;
  placeName?: string;
  accent: string;
  style: string;
  format: number;
  font: string;
  radius: string;
};

let schemaReady: Promise<void> | null = null;

function id(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${hex}`;
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const { env } = await import("cloudflare:workers");
      const db = (env as { DB?: D1Database }).DB;
      if (!db) throw new Error("D1 binding DB is unavailable.");
      await db.batch([
        db.prepare(`
          CREATE TABLE IF NOT EXISTS entitlements (
            id TEXT PRIMARY KEY,
            plan TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            stripe_session_id TEXT,
            stripe_customer_id TEXT,
            customer_email TEXT,
            draft_json TEXT,
            widget_id TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            paid_at TEXT
          )
        `),
        db.prepare(`
          CREATE UNIQUE INDEX IF NOT EXISTS entitlements_session_uidx
          ON entitlements(stripe_session_id)
        `),
        db.prepare(`
          CREATE TABLE IF NOT EXISTS widgets (
            id TEXT PRIMARY KEY,
            entitlement_id TEXT NOT NULL,
            place_id TEXT NOT NULL,
            place_name TEXT,
            accent TEXT NOT NULL DEFAULT '#1a73e8',
            style TEXT NOT NULL DEFAULT 'signature',
            format INTEGER NOT NULL DEFAULT 0,
            font TEXT NOT NULL DEFAULT 'modern',
            radius TEXT NOT NULL DEFAULT 'soft',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `),
      ]);
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

export async function createEntitlement(input: {
  plan: Plan;
  draft?: WidgetDraft | null;
}) {
  await ensureSchema();
  const db = getDb();
  const row = {
    id: id("ent"),
    plan: input.plan,
    status: "pending" as const,
    draftJson: input.draft ? JSON.stringify(input.draft) : null,
  };
  await db.insert(entitlements).values(row);
  return row.id;
}

export async function getEntitlement(entitlementId: string) {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.id, entitlementId))
    .limit(1);
  return rows[0] || null;
}

export async function getEntitlementBySession(sessionId: string) {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.stripeSessionId, sessionId))
    .limit(1);
  return rows[0] || null;
}

export async function attachCheckoutSession(
  entitlementId: string,
  sessionId: string,
) {
  await ensureSchema();
  const db = getDb();
  await db
    .update(entitlements)
    .set({ stripeSessionId: sessionId })
    .where(eq(entitlements.id, entitlementId));
}

export async function markEntitlementPaid(input: {
  entitlementId?: string;
  sessionId?: string;
  customerId?: string | null;
  customerEmail?: string | null;
}) {
  await ensureSchema();
  const db = getDb();
  let row = input.entitlementId
    ? await getEntitlement(input.entitlementId)
    : null;
  if (!row && input.sessionId)
    row = await getEntitlementBySession(input.sessionId);
  if (!row) return null;
  if (row.status === "paid" && row.widgetId) return row;

  const paidAt = new Date().toISOString();
  let widgetId = row.widgetId;

  if (!widgetId && row.draftJson) {
    try {
      const draft = JSON.parse(row.draftJson) as WidgetDraft;
      if (draft.placeId) {
        widgetId = await createWidgetFromDraft(row.id, draft);
      }
    } catch {}
  }

  await db
    .update(entitlements)
    .set({
      status: "paid",
      paidAt,
      stripeCustomerId: input.customerId || row.stripeCustomerId,
      customerEmail: input.customerEmail || row.customerEmail,
      widgetId,
      stripeSessionId: input.sessionId || row.stripeSessionId,
    })
    .where(eq(entitlements.id, row.id));

  return getEntitlement(row.id);
}

export async function createWidgetFromDraft(
  entitlementId: string,
  draft: WidgetDraft,
) {
  await ensureSchema();
  const db = getDb();
  const widgetId = id("w");
  const now = new Date().toISOString();
  await db.insert(widgets).values({
    id: widgetId,
    entitlementId,
    placeId: draft.placeId,
    placeName: draft.placeName || null,
    accent: draft.accent || "#1a73e8",
    style: draft.style || "signature",
    format: Number.isFinite(draft.format) ? draft.format : 0,
    font: draft.font || "modern",
    radius: draft.radius || "soft",
    createdAt: now,
    updatedAt: now,
  });
  await db
    .update(entitlements)
    .set({ widgetId })
    .where(eq(entitlements.id, entitlementId));
  return widgetId;
}

export async function getWidget(widgetId: string) {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(widgets)
    .where(eq(widgets.id, widgetId))
    .limit(1);
  return rows[0] || null;
}

export function parseDraft(raw?: string | null): WidgetDraft | null {
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as WidgetDraft;
    if (!draft?.placeId || typeof draft.placeId !== "string") return null;
    return {
      placeId: draft.placeId,
      placeName:
        typeof draft.placeName === "string" ? draft.placeName : undefined,
      accent: typeof draft.accent === "string" ? draft.accent : "#1a73e8",
      style: typeof draft.style === "string" ? draft.style : "signature",
      format: typeof draft.format === "number" ? draft.format : 0,
      font: typeof draft.font === "string" ? draft.font : "modern",
      radius: typeof draft.radius === "string" ? draft.radius : "soft",
    };
  } catch {
    return null;
  }
}
