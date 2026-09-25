import assert from "node:assert/strict";
import test from "node:test";
import {
  queryPlaces,
  SEARCH_FIELDS,
  DETAIL_FIELDS,
  safeGoogleUrl,
} from "../lib/places.ts";
test("Text Search sends bounded results and minimum search fields, with key in headers", async () => {
  let call;
  const result = await queryPlaces(
    { query: "Mario Rossi Dentist Miami" },
    "test-key",
    async (url, options) => {
      call = { url, options };
      return Response.json({
        places: [
          { id: "place123", displayName: { text: "Mario Rossi Dentist" } },
        ],
      });
    },
  );
  assert.equal(call.url, "https://places.googleapis.com/v1/places:searchText");
  assert.equal(call.options.headers["X-Goog-Api-Key"], "test-key");
  assert.equal(call.options.headers["X-Goog-FieldMask"], SEARCH_FIELDS);
  assert.equal(JSON.parse(call.options.body).pageSize, 5);
  assert.equal(
    JSON.parse(call.options.body).textQuery,
    "Mario Rossi Dentist Miami",
  );
  assert.equal(call.options.cache, "no-store");
  assert.equal(result.places[0].id, "place123");
});
test("Place Details requests the selected location and preserves original reviews/attribution", async () => {
  let call;
  const original = {
    id: "place123",
    rating: 3.7,
    userRatingCount: 21,
    reviews: [
      {
        rating: 2,
        text: { text: "Original unfiltered review" },
        authorAttribution: {
          displayName: "Pat",
          uri: "https://www.google.com/maps/contrib/123",
        },
        googleMapsUri: "https://www.google.com/maps/reviews/123",
      },
    ],
  };
  const result = await queryPlaces(
    { placeId: "place123" },
    "test-key",
    async (url, options) => {
      call = { url, options };
      return Response.json(original);
    },
  );
  assert.match(call.url, /\/places\/place123\?languageCode=en/);
  assert.doesNotMatch(call.url, /reviewsSort=/);
  assert.equal(call.options.method, "GET");
  assert.equal(call.options.body, undefined);
  assert.equal(call.options.headers["X-Goog-FieldMask"], DETAIL_FIELDS);
  assert.deepEqual(result, original);
});
test("upstream failures do not leak upstream error details or API keys", async () => {
  await assert.rejects(
    queryPlaces(
      { query: "test" },
      "secret-key",
      async () => new Response("secret details", { status: 403 }),
    ),
    /GOOGLE_UNAVAILABLE/,
  );
  await assert.rejects(
    queryPlaces(
      { query: "test" },
      "secret-key",
      async () => new Response("", { status: 429 }),
    ),
    /GOOGLE_BUSY/,
  );
});
test("attribution links only accept HTTPS URLs", () => {
  assert.equal(safeGoogleUrl("javascript:alert(1)"), undefined);
  assert.equal(safeGoogleUrl("data:text/html,test"), undefined);
  assert.equal(safeGoogleUrl("http://google.com"), undefined);
  assert.equal(
    safeGoogleUrl("https://maps.google.com/review"),
    "https://maps.google.com/review",
  );
});
