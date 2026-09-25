import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/** D1 helper for Cloudflare. On Vercel this throws at runtime (checkout unused). */
export function getDb() {
  let env: { DB?: D1Database };
  try {
    // Hide the specifier from Next/Webpack so `next build` succeeds on Vercel.
    const req = (0, eval)("require") as NodeRequire;
    const mod = req(["cloudflare", "workers"].join(":")) as {
      env: { DB?: D1Database };
    };
    env = mod.env;
  } catch {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable on this host. Waitlist works without it; checkout needs Cloudflare.",
    );
  }
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or inject the binding before using the database.",
    );
  }
  return drizzle(env.DB, { schema });
}
