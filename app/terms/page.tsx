import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — GoogleReviewsKit",
  description:
    "Terms of use and sale for GoogleReviewsKit, operated by Diego Simoncini.",
};

const SELLER = {
  name: "Diego Simoncini",
  address: "Via Capecchi 28, Pontedera (PI), 56026, Italy",
  vat: "02524780505",
  email: "diego.simoncini@webbitz.it",
  phone: "+39 339 179 7616",
};

export default function Terms() {
  return (
    <main className="wrap legal-page">
      <Link className="logo" href="/">
        <img
          className="logo-mark"
          src="/icons/icon-logo.png"
          alt=""
          width={34}
          height={34}
        />
        <span className="logo-wordmark">
          googlereviewskit<span className="logo-dot">.</span>
        </span>
      </Link>
      <h1>Terms &amp; Conditions</h1>
      <p>
        These Terms &amp; Conditions (“Terms”) govern access to and use of the{" "}
        <strong>GoogleReviewsKit</strong> website, free widget preview, and paid
        product. By using the service, you agree to these Terms.
      </p>
      <p>
        <strong>Last updated:</strong> 25 September 2026
      </p>

      <h2>1. Seller / service provider</h2>
      <p>GoogleReviewsKit is provided by:</p>
      <ul>
        <li>
          <strong>{SELLER.name}</strong>
        </li>
        <li>{SELLER.address}</li>
        <li>VAT / P.IVA: {SELLER.vat}</li>
        <li>
          Email: <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a>
        </li>
        <li>
          Phone:{" "}
          <a href={`tel:${SELLER.phone.replace(/\s/g, "")}`}>{SELLER.phone}</a>
        </li>
      </ul>

      <h2>2. The product</h2>
      <p>
        GoogleReviewsKit lets you explore widget designs, preview publicly
        available Google business information and reviews, and—after
        purchase—embed review widgets on one website for one business, with
        syncing while that feature remains active under your plan.
      </p>
      <p>
        Using the free builder does not create an account, reserve an offer, or
        complete a purchase. A free preview does not grant access to a Google
        Business Profile or authorize review management on Google.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old and able to enter into a binding
        contract. If you use GoogleReviewsKit on behalf of a business, you
        confirm you are authorized to do so.
      </p>

      <h2>4. Google content and trademarks</h2>
      <p>
        Business search and available reviews are supplied by Google Places. By
        using search, you are also subject to the{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noreferrer"
        >
          Google Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://maps.google.com/help/terms_maps/"
          target="_blank"
          rel="noreferrer"
        >
          Google Maps Additional Terms of Service
        </a>
        . See our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Google’s Privacy Policy
        </a>
        .
      </p>
      <p>
        Google determines which reviews appear. Review content belongs to its
        authors. Sample businesses and fictional reviews are clearly labeled and
        are not testimonials for GoogleReviewsKit.
      </p>
      <p>
        GoogleReviewsKit is an independent product and is not affiliated with,
        endorsed by, or sponsored by Google LLC. Google and related marks belong
        to Google LLC.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          misuse the search or preview (e.g. automated scraping, abuse, or
          attempts to bypass rate limits);
        </li>
        <li>
          use the service to display reviews in a misleading way, or to imply
          affiliation with Google;
        </li>
        <li>
          reverse engineer, resell, or redistribute the product except as
          expressly allowed in your purchase terms;
        </li>
        <li>
          use the service for unlawful purposes or in violation of third-party
          rights.
        </li>
      </ul>
      <p>
        We may suspend or terminate access if these Terms are violated or if use
        harms the service or other users.
      </p>

      <h2>6. Plans, pricing, and checkout</h2>
      <p>
        Current offers may include a free plan with monthly syncing, or a
        one-time founding-style purchase with lower monthly syncing. Prices
        shown on the site are indicative in USD unless otherwise stated. Taxes
        may apply depending on your location.
      </p>
      <p>
        Syncing after any included period is optional and billed as described at
        purchase or renewal. Cancel syncing anytime where the product allows; no
        automatic multi-year lock-in is implied beyond what you explicitly
        accept at checkout.
      </p>
      <p>
        Final purchase, delivery, support, and refund terms are confirmed at
        checkout before payment. When checkout is unavailable, no payment is
        accepted and no contract of sale is formed.
      </p>
      <p>
        One purchase covers one business and one website, unless a different
        scope is expressly agreed in writing.
      </p>

      <h2>7. Consumer withdrawal (EU / Italy)</h2>
      <p>
        If you are a consumer in the EU/EEA and purchase digital content or
        services online, you may have a 14-day right of withdrawal under
        Directive 2011/83/EU and the Italian Consumer Code, unless you request
        immediate performance and acknowledge that you lose the withdrawal right
        once delivery of the digital content or service has begun, where that
        exception applies.
      </p>
      <p>
        Exact withdrawal and refund conditions will be restated at checkout.
        Contact{" "}
        <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a> to exercise any
        applicable right.
      </p>

      <h2>8. Delivery and support</h2>
      <p>
        After a successful payment (when checkout is enabled), you receive
        access to the purchased GoogleReviewsKit features and setup
        instructions by email or through the channels indicated at purchase.
        Support is available at{" "}
        <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a> or{" "}
        {SELLER.phone}.
      </p>

      <h2>9. Availability and changes</h2>
      <p>
        We aim to keep the preview and product available, but we do not
        guarantee uninterrupted access. Features, pricing, and third-party
        integrations (including Google Places availability) may change. We may
        update these Terms; the “Last updated” date will change accordingly.
        Continued use after material updates constitutes acceptance where
        permitted by law; for ongoing paid services, significant changes will be
        communicated where required.
      </p>

      <h2>10. Disclaimer of warranties</h2>
      <p>
        Except as required by mandatory consumer law, GoogleReviewsKit is
        provided “as is.” We do not warrant that Google will always return the
        same set of reviews, that reviews will remain available, or that the
        widget will be compatible with every website platform or theme without
        customization.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, the seller is not
        liable for indirect, incidental, or consequential damages (including
        lost profits or loss of goodwill) arising from use of the preview or
        product. Nothing in these Terms excludes or limits liability for death
        or personal injury caused by negligence, fraud, or any other liability
        that cannot be limited under Italian or EU law.
      </p>
      <p>
        Where liability can be limited, it is capped at the amount you paid for
        GoogleReviewsKit in the twelve (12) months preceding the claim, unless
        mandatory law requires otherwise.
      </p>

      <h2>12. Intellectual property</h2>
      <p>
        The GoogleReviewsKit name, site design, code, and documentation are
        owned by {SELLER.name} or its licensors. Your purchase grants a limited,
        non-exclusive license to use the product for your business as described
        at sale. Google reviews and branding remain subject to Google’s and
        reviewers’ rights.
      </p>

      <h2>13. Privacy</h2>
      <p>
        Personal data is processed as described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>, in line with the GDPR.
      </p>

      <h2>14. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of Italy, without prejudice to
        mandatory consumer protections of your country of residence in the EU.
        Consumers may bring proceedings before the courts of their place of
        residence. The European Online Dispute Resolution platform is available
        at{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noreferrer"
        >
          https://ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a>, {SELLER.phone},{" "}
        {SELLER.address}.
      </p>

      <Link className="back-home" href="/">
        Back to GoogleReviewsKit
      </Link>
    </main>
  );
}
