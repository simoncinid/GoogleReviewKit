import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Payment entitlement — can exist before the widget is configured. */
export const entitlements = sqliteTable("entitlements", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(), // founding | monthly
  status: text("status").notNull().default("pending"), // pending | paid | canceled
  stripeSessionId: text("stripe_session_id"),
  stripeCustomerId: text("stripe_customer_id"),
  customerEmail: text("customer_email"),
  draftJson: text("draft_json"), // optional pre-checkout widget draft
  widgetId: text("widget_id"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  paidAt: text("paid_at"),
});

/** Published widget config — public embed target. */
export const widgets = sqliteTable("widgets", {
  id: text("id").primaryKey(),
  entitlementId: text("entitlement_id").notNull(),
  placeId: text("place_id").notNull(),
  placeName: text("place_name"),
  accent: text("accent").notNull().default("#1a73e8"),
  style: text("style").notNull().default("signature"),
  format: integer("format").notNull().default(0),
  font: text("font").notNull().default("modern"),
  radius: text("radius").notNull().default("soft"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
