import Link from "next/link";
export const metadata = { title: "Privacy — ReviewKit" };
export default function Privacy() {
  return (
    <main className="wrap legal-page">
      <Link className="logo" href="/">
        ✳ reviewkit.
      </Link>
      <h1>Your privacy.</h1>
      <p>
        This page explains how the ReviewKit landing page and widget preview
        handle information.
      </p>
      <h2>Business search</h2>
      <p>
        When you search, your business name and city are sent through our server
        to Google Places. When you select a business, we request its public
        details and the reviews Google makes available. Search results and
        reviews are displayed in your current browser session and are not saved
        to our database.
      </p>
      <p>
        Google processes these requests under its{" "}
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
      <h2>Your widget preferences</h2>
      <p>
        When you continue to checkout, your selected Place ID and widget design
        preferences are saved in this browser’s session storage so they can be
        used during setup. We do not save review content there. Closing the
        browser session clears this local draft.
      </p>
      <h2>Payments and site delivery</h2>
      <p>
        If a payment provider is connected, its privacy policy applies to
        information entered at checkout. Hosting providers may process technical
        request data, including IP addresses, to deliver and protect this site.
        The search endpoint uses a short-lived request counter to limit
        excessive traffic.
      </p>
      <h2>Tracking</h2>
      <p>
        This landing page does not include advertising pixels, marketing
        cookies, or analytics trackers. No Google account connection takes place
        during the free preview.
      </p>
      <Link className="back-home" href="/">
        Back to ReviewKit
      </Link>
    </main>
  );
}
