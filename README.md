# ReviewKit

Mobile-first landing page using React, TypeScript, and the Sites vinext starter.

Use Node 22.13+ and `npm ci`, then `npm run dev`. `npm run build` produces a Cloudflare-compatible worker and assets in dist/.

## Before accepting payments

Set REVIEWKIT_CHECKOUT_URL to the HTTPS hosted payment link for the $99 USD one-time offer. All purchase CTAs share this destination. Without it, a dialog explicitly says checkout is not open. No purchase or reservation is simulated.

The offer includes one business/site and 12 months of syncing. Optional annual syncing renewal is not automatically charged. The exact renewal price is not yet announced; update pricing, FAQ, and payment terms consistently when decided. Add your finalized business/contact details and commercial terms before accepting payments.

## Scope

This is the landing page, not the underlying review-syncing SaaS. Widget previews use clearly marked fictional data. The business name personalizes local React state only and does not fetch Google reviews. Five widget formats, colors, carousel, comparison, mobile navigation, native FAQ disclosures, and native accessible dialogs are interactive.

No analytics pixels, tracking cookies, external photos, or client-side API secrets are included. The font is bundled by the framework. Add consent-aware measurement when the actual tracking configuration and privacy policy are available.

Sites hosting defaults to private access. Configure public access and a production domain before starting ads.
