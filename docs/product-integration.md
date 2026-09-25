# GoogleReviewsKit: preview to live widget

## Implemented now

1. Landing CTA: Try your widget for free.
2. Server-side Places API (New) Text Search for business name/city.
3. User chooses a place by name/address; Place ID identifies the result.
4. Place Details supplies the rating, count, and available review subset.
5. Interactive widget editor renders the actual available reviews, retaining attribution and original text.
6. Add this to my website stores only Place ID and style settings in sessionStorage, then follows the configured hosted payment link. No Google review content is persisted.

## Post-purchase integration still required

- Create checkout sessions server-side and attach an opaque draft/session identifier; do not trust a return URL or sessionStorage as purchase verification.
- A verified, idempotent payment webhook grants the one-business, one-site entitlement and 12-month sync window. Checkout success connects to the buyer account and retrieves the draft.
- Offer Connect Google Business Profile only after login. Use OAuth authorization code flow with state/PKCE and server-held credentials, least-privilege business.manage scope, encrypted refresh tokens, and disconnect/revocation handling. Google API access/approval and a configured OAuth consent screen are prerequisites.
- List the authorized accounts and owned/managed locations. Let the user choose the verified location explicitly. A Places Place ID is not itself the Business Profile account/location resource identifier; resolve the mapping rather than assuming identity.
- Import reviews via accounts.locations.reviews.list, following every nextPageToken. Import the account's actual accessible reviews rather than the Places preview subset.
- Store the widget configuration separately from Google credentials. Issue a public opaque widget identifier, domain-scope the installation, and publish a versioned embed endpoint.
- Run scheduled sync with idempotent updates, pagination, retry/backoff, quota management, and token-refresh handling. Show last successful sync and surface disconnections.
- At the end of 12 months, follow the actual published retention/display and renewal policy. Never charge a renewal that was not explicitly agreed.

## Official references

- Text Search: https://developers.google.com/maps/documentation/places/web-service/text-search
- Place Details: https://developers.google.com/maps/documentation/places/web-service/place-details
- Places attribution policies: https://developers.google.com/maps/documentation/places/web-service/policies
- Business Profile review listing: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
- Business Profile OAuth: https://developers.google.com/my-business/content/implement-oauth
