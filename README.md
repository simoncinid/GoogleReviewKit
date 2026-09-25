# GoogleReviewsKit

Mobile-first landing page and free interactive widget builder, using React, TypeScript, and Sites/vinext.

## Development

Node 22.13+ (native TypeScript stripping for the request contract tests). `npm ci`, `npm run dev`. `npm run build` creates a Cloudflare-compatible worker in dist/. `npm test` builds and tests rendering, legal routes, the Places endpoint, and mocked Google request contracts. `npm run lint` and `npx tsc --noEmit` check the source.

## Google Places preview

Set the server-only secret `GOOGLE_PLACES_API_KEY` in Sites environment settings and deploy. For local Cloudflare bindings, put it in ignored `.dev.vars`. Enable Places API (New), billing, restrict the key to that API, and configure quotas/budget alerts in Google Cloud. No secret is sent to the client or added to a URL.

The implemented flow is explicit Text Search (New), business selection, then Place Details (New). Search returns at most five businesses with name/address, without requesting reviews for every match. Details request rating, count, available reviews, original text, author attribution, Maps links, and provider attribution only for the selected business. This uses the Google field masks defined in lib/places.ts. Review queries can incur Google's Enterprise + Atmosphere SKU charges.

There is no Google review caching or database persistence. Preview reviews are not filtered by rating. They keep Google relevance order; users can navigate the carousel. Authors, original Maps links, and provider attributions are preserved. The official unmodified Google Maps attribution asset is bundled locally. Missing keys, unavailable Google service, empty search results, no written reviews, malformed requests and cross-origin requests have explicit states. Requests have a 10-second timeout and a best-effort per-isolate 12 requests/minute/IP limiter; configure an edge rate limiter and Google project quotas before public ad traffic. A missing key never generates a fake search match.

## Widget customization

Five formats, Signature / Editorial / Contrast styles, preset or arbitrary brand colors, Modern / Classic typography, and three corner treatments. Desktop/mobile preview toggle, responsive layouts, accessible tabs, no animation. The sample business is fictional and labeled. Only a Place ID and design settings are stored in sessionStorage when proceeding to checkout; returned Google review data is not stored. /privacy and /terms describe the free preview.

## Payment and post-purchase scope

Set `REVIEWKIT_CHECKOUT_URL` to the HTTPS payment link for the $99 one-time offer. All purchase CTAs share the destination. Without the link, the page explains checkout is not open and does not simulate a transaction. Final seller identity, support details, purchase/refund terms, and annual syncing renewal price must be set before selling. The displayed renewal is optional and not automatically billed.

The post-purchase SaaS is not implemented by this landing page. The intended handoff is payment verification → account/login → Connect Google Business Profile → OAuth → owned/verified location selection → paginated reviews import → published widget. See docs/product-integration.md. Never use Places preview content as the full review-syncing product or browser session data as proof of purchase.

No ad pixels or analytics trackers are installed. Sites hosting remains private until public access is explicitly enabled. The generated, inspected social card is public/og.png. The on-page widgets remain real editable UI rather than flat mockup images.
