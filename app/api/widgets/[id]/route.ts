import { getWidget } from "../../../../lib/commerce";
import { queryPlaces } from "../../../../lib/places";
import { readEnv } from "../../../../lib/stripe";

function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id || !/^w_[a-f0-9]{24}$/.test(id))
    return reply({ error: "Widget not found." }, 404);

  const widget = await getWidget(id);
  if (!widget) return reply({ error: "Widget not found." }, 404);

  const key = await readEnv("GOOGLE_PLACES_API_KEY");
  if (!key)
    return reply({ error: "Widget data is temporarily unavailable." }, 503);

  try {
    const place = (await queryPlaces({ placeId: widget.placeId }, key)) as {
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: unknown[];
      error?: string;
    };
    return reply({
      id: widget.id,
      placeId: widget.placeId,
      name: widget.placeName || place.displayName?.text || "Business",
      rating: place.rating,
      count: place.userRatingCount ?? 0,
      mapsHref: place.googleMapsUri,
      reviews: place.reviews || [],
      accent: widget.accent,
      style: widget.style,
      format: widget.format,
      font: widget.font,
      radius: widget.radius,
    });
  } catch {
    return reply({ error: "Could not load reviews for this widget." }, 502);
  }
}
