import Link from "next/link";
export const metadata = { title: "Preview terms — ReviewKit" };
export default function Terms() {
  return (
    <main className="wrap legal-page">
      <Link className="logo" href="/">
        ✳ reviewkit.
      </Link>
      <h1>Free preview terms.</h1>
      <p>
        The ReviewKit widget builder lets you explore widget designs and preview
        public business information. Using the builder does not create an
        account, reserve an offer, or complete a purchase.
      </p>
      <h2>Google content</h2>
      <p>
        Business search and available reviews are supplied by Google Places. By
        using this search, you are also subject to the{" "}
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
        . See our <a href="/privacy">Privacy Policy</a> and{" "}
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
        Google determines which reviews are available in this preview. Review
        content belongs to its authors. A sample business and fictional reviews
        are clearly labeled and are not testimonials for ReviewKit.
      </p>
      <h2>The founding offer</h2>
      <p>
        The displayed offer is $99 USD for one business and one website, with 12
        months of automatic syncing included. Continued syncing after that
        period is optional. Its price will be shown before you choose to renew,
        with no automatic renewal.
      </p>
      <p>
        Final purchase, delivery, support, and refund terms must be provided at
        checkout before payment. When checkout is unavailable, no payment is
        accepted.
      </p>
      <h2>Independent product</h2>
      <p>
        ReviewKit is independent of Google LLC. A free preview does not grant
        access to a Google Business Profile or authorize review management.
      </p>
      <Link className="back-home" href="/">
        Back to ReviewKit
      </Link>
    </main>
  );
}
