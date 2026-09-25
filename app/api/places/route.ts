import { queryPlaces } from "../../../lib/places";
const limits = new Map<string, { count: number; until: number }>();
function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply({ error: "This search is only available on GoogleReviewsKit." }, 403);
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return reply({ error: "This search is only available on GoogleReviewsKit." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Expected a search request." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 2048)
    return reply({ error: "Search is too long." }, 413);
  let input: { query?: string; placeId?: string };
  try {
    const raw = await request.text();
    if (raw.length > 2048) return reply({ error: "Search is too long." }, 413);
    input = JSON.parse(raw);
    if (!input || typeof input !== "object") throw new Error();
  } catch {
    return reply({ error: "Enter a business name and city." }, 400);
  }
  const query = typeof input.query === "string" ? input.query.trim() : "";
  const placeId = typeof input.placeId === "string" ? input.placeId : "";
  if (
    !!query === !!placeId ||
    (query && (query.length < 3 || query.length > 160)) ||
    (placeId && !/^[a-zA-Z0-9_-]{5,255}$/.test(placeId))
  )
    return reply(
      { error: "Enter a business name and city (3–160 characters)." },
      400,
    );
  let key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) {
    try {
      const { env } = await import("cloudflare:workers");
      key = (
        env as { GOOGLE_PLACES_API_KEY?: string }
      ).GOOGLE_PLACES_API_KEY?.trim();
    } catch {}
  }
  if (!key)
    return reply(
      {
        code: "NOT_CONFIGURED",
        error:
          "Live business search is not available yet. Try the sample widgets below.",
      },
      503,
    );
  // Per-isolate throttle. Configure edge rate limits and Google project quotas before public advertising.
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const now = Date.now();
  for (const [id, value] of limits) if (value.until < now) limits.delete(id);
  const bucket = limits.get(ip) || { count: 0, until: now + 60000 };
  if (bucket.count >= 40)
    return reply(
      { error: "A few too many searches. Please try again in a minute." },
      429,
    );
  bucket.count++;
  limits.set(ip, bucket);
  try {
    const result = await queryPlaces(placeId ? { placeId } : { query }, key);
    return reply(result);
  } catch {
    return reply(
      {
        error:
          "Google search is temporarily unavailable. Please try again or explore the sample widgets.",
      },
      502,
    );
  }
}
