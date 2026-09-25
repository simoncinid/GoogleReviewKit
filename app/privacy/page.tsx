import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — GoogleReviewsKit",
  description:
    "How GoogleReviewsKit processes personal data under the GDPR (EU Regulation 2016/679).",
};

const CONTROLLER = {
  name: "Diego Simoncini",
  address: "Via Capecchi 28, Pontedera (PI), 56026, Italy",
  vat: "02524780505",
  email: "diego.simoncini@webbitz.it",
  phone: "+39 339 179 7616",
};

export default function Privacy() {
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
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy explains how <strong>GoogleReviewsKit</strong>{" "}
        processes personal data when you visit this website, use the widget
        preview, or purchase the product. It is provided pursuant to Articles 13
        and 14 of Regulation (EU) 2016/679 (GDPR) and applicable Italian data
        protection law.
      </p>
      <p>
        <strong>Last updated:</strong> 25 September 2026
      </p>

      <h2>1. Data controller</h2>
      <p>
        The data controller (titolare del trattamento) is:
      </p>
      <ul>
        <li>
          <strong>{CONTROLLER.name}</strong>
        </li>
        <li>{CONTROLLER.address}</li>
        <li>VAT / P.IVA: {CONTROLLER.vat}</li>
        <li>
          Email:{" "}
          <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>
        </li>
        <li>
          Phone:{" "}
          <a href={`tel:${CONTROLLER.phone.replace(/\s/g, "")}`}>
            {CONTROLLER.phone}
          </a>
        </li>
      </ul>
      <p>
        For any privacy request, contact the controller at{" "}
        <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>.
      </p>

      <h2>2. What this service does</h2>
      <p>
        GoogleReviewsKit is an independent product that helps businesses display
        publicly available Google reviews on their websites through embeddable
        widgets. It is not affiliated with Google LLC. Google and related marks
        are trademarks of Google LLC.
      </p>

      <h2>3. Categories of data processed</h2>
      <p>Depending on how you use the site, we may process:</p>
      <ul>
        <li>
          <strong>Technical data:</strong> IP address, browser type, request
          metadata, and similar logs processed by hosting infrastructure to
          deliver and secure the site.
        </li>
        <li>
          <strong>Business search input:</strong> the business name and/or
          location you type, and the Place ID you select.
        </li>
        <li>
          <strong>Public Google Places data:</strong> business details and
          reviews that Google makes available for the selected place, shown in
          your browser session for preview.
        </li>
        <li>
          <strong>Widget preferences:</strong> design choices (format, colors,
          layout) and the selected Place ID, stored locally in your browser when
          you continue toward checkout.
        </li>
        <li>
          <strong>Purchase and support data:</strong> if you buy or contact us,
          billing and contact details needed to fulfill the order, provide
          support, and meet legal obligations (processed by us and/or the
          payment provider).
        </li>
      </ul>
      <p>
        We do not ask you to connect a Google account during the free preview,
        and we do not intentionally collect special categories of personal data
        (GDPR Art. 9).
      </p>

      <h2>4. Purposes and legal bases</h2>
      <ul>
        <li>
          <strong>Provide the landing page and widget preview</strong>{" "}
          (including business search via Google Places) — Art. 6(1)(b) GDPR
          (steps prior to a contract / service request) and, where needed for
          security and abuse prevention, Art. 6(1)(f) (legitimate interest).
        </li>
        <li>
          <strong>Deliver the product after purchase</strong> (access,
          installation guidance, syncing while active) — Art. 6(1)(b).
        </li>
        <li>
          <strong>Payments and invoicing</strong> — Art. 6(1)(b) and Art.
          6(1)(c) (legal obligations under tax and accounting law).
        </li>
        <li>
          <strong>Respond to support and privacy requests</strong> — Art.
          6(1)(b) and/or Art. 6(1)(f).
        </li>
        <li>
          <strong>Defend legal claims and ensure site security</strong>{" "}
          (including short-lived request rate limiting) — Art. 6(1)(f).
        </li>
      </ul>
      <p>
        Where we rely on legitimate interests, you may object under the
        conditions of Art. 21 GDPR (see section 9).
      </p>

      <h2>5. Google Places and third parties</h2>
      <p>
        When you search or select a business, your query and related requests
        are sent through our server to Google Places. Google processes those
        requests under its own terms and{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        . Opening Google Maps links or loading reviewer photos also connects
        your browser to Google.
      </p>
      <p>
        If a payment provider is connected at checkout, that provider acts as an
        independent controller (or joint controller, as stated in its notices)
        for payment data. Its privacy policy applies to information entered
        there.
      </p>
      <p>
        Hosting and infrastructure providers process technical request data as
        processors or providers necessary to operate the service.
      </p>

      <h2>6. Storage and retention</h2>
      <ul>
        <li>
          Search results and review content shown in the free preview are
          displayed in your current browser session and are{" "}
          <strong>not saved to our database</strong> for that preview.
        </li>
        <li>
          Widget preferences and Place ID may be stored in this browser’s{" "}
          <strong>session storage</strong> so they can be reused during setup.
          Closing the session clears that local draft.
        </li>
        <li>
          Technical logs and rate-limit counters are kept only as long as needed
          for security and operations (typically short-lived).
        </li>
        <li>
          Purchase, invoicing, and support records are retained for the period
          required by Italian tax and civil law, and then deleted or anonymized
          where feasible.
        </li>
      </ul>

      <h2>7. Transfers outside the EEA</h2>
      <p>
        Google and some infrastructure or payment providers may process data in
        countries outside the European Economic Area. Where that occurs,
        transfers rely on appropriate safeguards under Chapter V GDPR (such as
        adequacy decisions or Standard Contractual Clauses), as described in
        those providers’ documentation.
      </p>

      <h2>8. Cookies and tracking</h2>
      <p>
        This landing page does <strong>not</strong> use advertising pixels,
        marketing cookies, or analytics trackers. Strictly technical mechanisms
        required to deliver the page, protect it, or store a temporary widget
        draft in session storage may be used. No Google account connection takes
        place during the free preview.
      </p>

      <h2>9. Your rights</h2>
      <p>Under the GDPR, you may have the right to:</p>
      <ul>
        <li>access your personal data (Art. 15);</li>
        <li>rectify inaccurate data (Art. 16);</li>
        <li>erase data (Art. 17), where applicable;</li>
        <li>restrict processing (Art. 18);</li>
        <li>data portability (Art. 20), where applicable;</li>
        <li>object to processing based on legitimate interests (Art. 21);</li>
        <li>
          withdraw consent at any time, where processing is based on consent,
          without affecting prior lawful processing;
        </li>
        <li>
          lodge a complaint with the Italian Data Protection Authority (
          <em>Garante per la protezione dei dati personali</em> —{" "}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">
            www.garanteprivacy.it
          </a>
          ) or another competent supervisory authority in the EU.
        </li>
      </ul>
      <p>
        To exercise your rights, email{" "}
        <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>. We will
        respond within the timeframes required by law.
      </p>

      <h2>10. Automated decision-making</h2>
      <p>
        We do not use your personal data for automated decision-making that
        produces legal or similarly significant effects (GDPR Art. 22).
      </p>

      <h2>11. Minors</h2>
      <p>
        GoogleReviewsKit is directed at business users. It is not intended for
        children under 16. If you believe a minor has provided personal data,
        contact us so we can delete it where appropriate.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this Privacy Policy to reflect product, legal, or
        operational changes. The “Last updated” date at the top will be revised
        accordingly. Material changes will be highlighted on this page when
        reasonably possible.
      </p>

      <h2>13. Contact</h2>
      <p>
        Controller: {CONTROLLER.name}, {CONTROLLER.address}, P.IVA{" "}
        {CONTROLLER.vat}. Email:{" "}
        <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>. Phone:{" "}
        {CONTROLLER.phone}.
      </p>

      <Link className="back-home" href="/">
        Back to GoogleReviewsKit
      </Link>
    </main>
  );
}
