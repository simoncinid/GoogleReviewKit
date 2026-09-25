import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
      ...init,
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("serves the GoogleReviewsKit landing page with offer and example disclosure", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  const html = await response.text();
  assert.match(html, /<title>GoogleReviewsKit/);
  assert.match(html, /12 months of automatic Google review syncing/);
  assert.match(html, /fictional example reviews/);
  assert.match(html, /Checkout is not open yet/);
  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|Your site is taking shape/,
  );
});

test("serves public privacy and preview terms", async () => {
  for (const path of ["/privacy", "/terms"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /policies.google.com/);
  }
});
test("Places endpoint rejects malformed and cross-origin requests", async () => {
  let response = await render("/api/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://untrusted.example",
    },
    body: JSON.stringify({ query: "Dentist Miami" }),
  });
  assert.equal(response.status, 403);
  response = await render("/api/places", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "x" }),
  });
  assert.equal(response.status, 400);
  response = await render("/api/places", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId: "../../invalid" }),
  });
  assert.equal(response.status, 400);
});
test("Places endpoint reports an unconfigured search without invented results", async () => {
  const saved = process.env.GOOGLE_PLACES_API_KEY;
  delete process.env.GOOGLE_PLACES_API_KEY;
  try {
    const response = await render("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Dentist Miami" }),
    });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await response.json()).code, "NOT_CONFIGURED");
  } finally {
    if (saved) process.env.GOOGLE_PLACES_API_KEY = saved;
  }
});
