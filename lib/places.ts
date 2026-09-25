export type GoogleReview = {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
  visitDate?: { year?: number; month?: number };
  /** Optional media URLs when available (sample / future enrichment). */
  photoUrls?: string[];
  /** Optional Local Guide flag when known (sample / enrichment). */
  isLocalGuide?: boolean;
};
export type Place = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  googleMapsLinks?: { writeAReviewUri?: string };
  attributions?: { provider?: string; providerUri?: string }[];
  reviews?: GoogleReview[];
};
export const SEARCH_FIELDS =
  "places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.attributions,places.rating,places.userRatingCount";
/** Place Details (New): include originalText so we never rely on translated review copy. */
export const DETAIL_FIELDS =
  "id,displayName,formattedAddress,rating,userRatingCount,reviews,reviews.originalText,reviews.text,reviews.rating,reviews.relativePublishTimeDescription,reviews.publishTime,reviews.authorAttribution,reviews.googleMapsUri,reviews.visitDate,googleMapsUri,googleMapsLinks,attributions";
export type ReviewsSort = "MOST_RELEVANT" | "NEWEST";
export function safeGoogleUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
export async function queryPlaces(
  input: {
    query?: string;
    placeId?: string;
    reviewsSort?: ReviewsSort;
  },
  key: string,
  upstream: typeof fetch = fetch,
) {
  const detail = !!input.placeId;
  const endpoint = detail
    ? `https://places.googleapis.com/v1/places/${encodeURIComponent(input.placeId!)}?languageCode=en&regionCode=US`
    : "https://places.googleapis.com/v1/places:searchText";
  const response = await upstream(endpoint, {
    method: detail ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": detail ? DETAIL_FIELDS : SEARCH_FIELDS,
    },
    body: detail
      ? undefined
      : JSON.stringify({
          textQuery: input.query,
          languageCode: "en",
          regionCode: "US",
          pageSize: 5,
          includePureServiceAreaBusinesses: true,
        }),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      response.status === 429 ? "GOOGLE_BUSY" : "GOOGLE_UNAVAILABLE",
    );
  return response.json() as Promise<Place | { places?: Place[] }>;
}
