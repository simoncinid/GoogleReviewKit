"use client";
import { useState, useRef, useEffect } from "react";
import WidgetBuilder from "./components/widget-builder";
const reviews = [
  {
    name: "Sarah M.",
    initials: "SM",
    color: "peach",
    date: "2 weeks ago",
    text: "The kind of business you’re happy to recommend. Friendly, professional, and so easy to work with. We’ll definitely be back!",
  },
  {
    name: "James R.",
    initials: "JR",
    color: "sage",
    date: "1 month ago",
    text: "A great experience from start to finish. They took the time to answer every question and delivered exactly what they promised.",
  },
  {
    name: "Emily W.",
    initials: "EW",
    color: "lavender",
    date: "1 month ago",
    text: "So glad we found them. You can tell they really care about their customers. Easily a five-star experience.",
  },
];
const faqs = [
  [
    "What do I need to use ReviewKit?",
    "A business with a Google Business Profile, existing Google reviews, and a website where you can add an embed snippet. You don’t need a new website.",
  ],
  [
    "Will it work with my website?",
    "ReviewKit is designed for websites that support custom HTML or embed blocks, including WordPress, Webflow, Squarespace, Wix, Shopify, and custom sites. Some platforms require a paid plan to add custom code.",
  ],
  [
    "How do my Google reviews get onto my website?",
    "Connect your Google Business Profile, choose a widget, and add the embed snippet to your site. ReviewKit displays your reviews and keeps them updated while syncing is active. Search your business in the free builder to preview the reviews Google makes available. Sample widgets are clearly labeled.",
  ],
  [
    "What happens after the first 12 months?",
    "Your $99 purchase includes 12 months of automatic review syncing for one business and one website. Continued syncing is optional for a small annual fee. The renewal price has not been announced yet. You will see the exact price before choosing to renew. There is no automatic renewal.",
  ],
  [
    "Can I match the widgets to my brand?",
    "Yes. Choose from five widget formats and customize the colors and layout to fit your website. All formats are responsive, so your reviews look good on phones, tablets, and desktops.",
  ],
  [
    "Is ReviewKit affiliated with Google?",
    "No. ReviewKit is an independent product. Google and its trademarks belong to Google LLC. Your customers’ reviews remain their original reviews on Google.",
  ],
];
function Stars() {
  return (
    <span className="stars" aria-label="5 out of 5 stars">
      ★★★★★
    </span>
  );
}
function Google() {
  return (
    <span className="google-g" aria-label="Google">
      G
    </span>
  );
}
function Logo() {
  return (
    <a className="logo" href="#" aria-label="ReviewKit home">
      <span className="logo-mark">✳</span>reviewkit
      <span className="logo-dot">.</span>
    </a>
  );
}
function Check({ children }: { children: React.ReactNode }) {
  return (
    <span className="check-item">
      <span className="check" aria-hidden="true">
        ✓
      </span>
      {children}
    </span>
  );
}
function Review({
  index = 0,
  mini = false,
}: {
  index?: number;
  mini?: boolean;
}) {
  const r = reviews[index % 3];
  return (
    <article className={`review-card ${mini ? "mini" : ""}`}>
      <div className="review-person">
        <span className={`avatar ${r.color}`}>{r.initials}</span>
        <div>
          <strong>{r.name}</strong>
          <small>{r.date}</small>
        </div>
        <Google />
      </div>
      <Stars />
      <p>{r.text}</p>
      <span className="posted">
        Posted on <b>Google</b>
      </span>
    </article>
  );
}
function CTA({
  children = "Get ReviewKit — $99",
  onClick,
}: {
  children?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="button primary" onClick={onClick}>
      {children}
    </button>
  );
}
export default function ReviewKit({ checkoutUrl }: { checkoutUrl: string }) {
  const [after, setAfter] = useState(true),
    [menu, setMenu] = useState(false),
    [modal, setModal] = useState<"checkout" | "privacy" | "review" | null>(
      null,
    );
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (modal) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);
  function buy(config?: {
    placeId: string;
    accent: string;
    style: string;
    format: number;
    font: string;
    radius: string;
  }) {
    if (config) {
      try {
        sessionStorage.setItem(
          "reviewkit-widget-draft",
          JSON.stringify(config),
        );
      } catch {}
    }
    if (checkoutUrl && /^https:\/\//.test(checkoutUrl))
      window.location.assign(checkoutUrl);
    else setModal("checkout");
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span className="status-dot" />A little launch. A really good deal.{" "}
        <a href="#pricing">Get the $99 founding price</a>
      </div>
      <header className="header wrap">
        <Logo />
        <nav aria-label="Main navigation" className={menu ? "nav open" : "nav"}>
          {[
            ["The widgets", "playground"],
            ["How it works", "how-it-works"],
            ["Pricing", "pricing"],
            ["FAQs", "faq"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="button nav-cta" href="#pricing">
          Get ReviewKit{" "}
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? "✕" : "☰"}
        </button>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-stars">★★★★★</span> GOOD REVIEWS DESERVE TO
              BE SEEN
            </span>
            <h1>
              You earned
              <br />
              the trust.
              <br />
              <span>Show it off.</span>
            </h1>
            <p className="hero-description">
              You worked hard for your Google reviews.
              <br className="desktop-break" /> Put them to work on your website.
            </p>
            <p className="hero-detail">
              Your reviews. Your colors. Your look. Build a widget that feels
              like it was made for your website — because it was.
            </p>
            <div className="hero-actions">
              <a href="#playground" className="button primary">
                Try your widget for free
              </a>
              <a href="#pricing" className="demo-link">
                Get ReviewKit — $99
              </a>
            </div>
            <div className="hero-checks">
              <Check>No signup to try</Check>
              <Check>No coding needed</Check>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-note">
              YOUR REPUTATION. YOUR SIGNATURE LOOK.
            </div>
            <div className="browser">
              <div className="browser-bar">
                <span className="browser-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="address">▣ &nbsp; oakandmaple.com</span>
                <span>↗</span>
              </div>
              <div className="example-site">
                <div className="example-nav">
                  <span className="dental-logo">
                    o<span>&</span>m{" "}
                    <small>
                      OAK & MAPLE
                      <br />
                      DENTAL STUDIO
                    </small>
                  </span>
                  <span className="example-nav-links">
                    Our approach &nbsp; Services &nbsp; <b>Book a visit</b>
                  </span>
                </div>
                <div className="example-hero">
                  <span className="example-eyebrow">
                    A LITTLE CARE GOES A LONG WAY.
                  </span>
                  <h2>
                    A healthier smile.
                    <br />A happier you.
                  </h2>
                  <p>Thoughtful dental care for the whole family.</p>
                  <span className="example-button">Let’s meet</span>
                  <div className="plant-art" aria-hidden="true">
                    <div className="plant-stem" />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="example-reviews">
                  <div className="example-reviews-title">
                    <div>
                      <h3>Good people. Happy smiles.</h3>
                      <span>
                        <Stars /> <b>4.9</b> on Google
                      </span>
                    </div>
                    <span>← &nbsp; →</span>
                  </div>
                  <div className="mini-reviews">
                    <Review mini />
                    <Review mini index={1} />
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-proof">
              <div className="proof-icon">✦</div>
              <div>
                <b>A little proof. A lot of trust.</b>
                <span>Your Google reviews, beautifully displayed.</span>
              </div>
              <span className="proof-check">✓</span>
            </div>
            <span className="hero-example-label">
              Illustrative website · fictional example reviews
            </span>
          </div>
        </section>
        <section className="platforms wrap" aria-label="Website compatibility">
          <span>
            YOUR WEBSITE. YOUR PLATFORM.
            <br />
            <b>Fits right in.</b>
          </span>
          <div className="platform-list">
            <span className="wordpress">ⓦ WordPress</span>
            <span className="webflow">≋ Webflow</span>
            <span className="squarespace">▧ SQUARESPACE</span>
            <span className="wix">WiX</span>
            <span className="shopify">
              ▰ <i>shopify</i>
            </span>
            <span className="custom">
              &lt;/&gt; <b>And yours.</b>
            </span>
          </div>
        </section>
        <WidgetBuilder onBuy={buy} />
        <section className="benefits wrap section">
          <div className="benefit-intro">
            <span className="eyebrow">LET YOUR CUSTOMERS DO THE TALKING</span>
            <h2>
              You say you’re great.
              <br />
              <span>They make it believable.</span>
            </h2>
          </div>
          <div className="benefit-grid">
            {[
              [
                "✧",
                "Trust, before the first hello.",
                "Give visitors the reassurance of real customer experiences, right when they’re deciding.",
              ],
              [
                "↗",
                "Keep the good stuff on your site.",
                "No extra tabs. No trip back to Google. Put your reputation next to your booking or contact button.",
              ],
              [
                "⟳",
                "Fresh proof. Without the upkeep.",
                "New reviews show up automatically with active syncing. Set it up, then get back to your business.",
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <span className="feature-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="transformation wrap">
          <div className="transformation-copy">
            <span className="eyebrow">SAME WEBSITE. MORE CONFIDENCE.</span>
            <h2>
              Don’t just tell them.
              <br />
              Give them a reason
              <br />
              <em>to believe.</em>
            </h2>
            <p>
              Your next customer is already on your website. Help them feel good
              about taking the next step.
            </p>
            <a className="text-link" href="#pricing">
              Put your reviews to work{" "}
            </a>
          </div>
          <div>
            <div
              className="comparison-switch"
              role="group"
              aria-label="Website comparison"
            >
              <button aria-pressed={!after} onClick={() => setAfter(false)}>
                Before ReviewKit
              </button>
              <button aria-pressed={after} onClick={() => setAfter(true)}>
                With ReviewKit ✦
              </button>
            </div>
            <div className="comparison-site">
              <span className="comparison-logo">
                EVERGREEN <small>HOME SERVICES</small>
              </span>
              <h3>
                Your home.
                <br />
                In good hands.
              </h3>
              <p>Local experts. Thoughtful service.</p>
              <span className="example-button">Get a free estimate</span>
              <div className={`comparison-proof ${after ? "visible" : ""}`}>
                {after ? (
                  <>
                    <Google />
                    <div>
                      <b>Your neighbors recommend us.</b>
                      <span>
                        <Stars /> <strong>4.9</strong> from 128 reviews
                      </span>
                    </div>
                    <span>✓</span>
                  </>
                ) : (
                  <span className="empty-proof">
                    A promise is good.
                    <br />A little proof is better.
                  </span>
                )}
              </div>
              <span className="comparison-caption">
                {after
                  ? "A confident next step starts with a little social proof."
                  : "Looks nice. But what do real customers think?"}
              </span>
            </div>
            <small className="sample-caption">
              Illustrative example. Results depend on your business and website.
            </small>
          </div>
        </section>
        <section className="how-it-works section wrap" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">LESS SETUP. MORE SHOWING OFF.</span>
            <h2>
              From Google to your website.
              <br />
              In three simple steps.
            </h2>
          </div>
          <div className="steps">
            <article>
              <div className="step-number">
                01<span>↗</span>
              </div>
              <h3>Connect your business.</h3>
              <p>
                Link your Google Business Profile. Your hard-earned reviews come
                with you.
              </p>
              <div className="step-visual">
                <Google />
                <span>Your business</span>
                <span className="connected">✓ Connected</span>
              </div>
            </article>
            <article>
              <div className="step-number">
                02<span>↗</span>
              </div>
              <h3>Make it feel like you.</h3>
              <p>
                Pick a widget, choose your colors, and find the perfect fit for
                your website.
              </p>
              <div className="step-visual swatch-visual">
                <i />
                <i />
                <i />
                <i />
                <span>Made to match.</span>
              </div>
            </article>
            <article>
              <div className="step-number">
                03<span>✓</span>
              </div>
              <h3>Paste. Publish. Done.</h3>
              <p>
                Add your snippet to your website’s embed block. Your reviews are
                ready to shine.
              </p>
              <div className="step-visual">
                <span className="code-symbol">&lt;/&gt;</span>
                <span>One small snippet.</span>
                <span className="connected">That’s it.</span>
              </div>
            </article>
          </div>
          <p className="setup-note">
            No developer required. Just access to your website’s editor.
          </p>
        </section>
        <section className="pricing-section section" id="pricing">
          <div className="wrap pricing-layout">
            <div className="pricing-copy">
              <span className="eyebrow">
                A SMALL INVESTMENT IN A STRONGER FIRST IMPRESSION
              </span>
              <h2>
                Good for your website.
                <br />
                <em>Easy on your budget.</em>
              </h2>
              <p>
                No monthly software bill. No complicated tiers.
                <br />
                Just everything you need to put your reviews to work.
              </p>
              <div className="founder-note">
                <span>✳</span>
                <div>
                  <h3>A thank-you for getting in early.</h3>
                  <p>
                    We’re building ReviewKit for small businesses like yours.
                    The founding price is our launch offer: all five widgets,
                    one simple payment.
                  </p>
                </div>
              </div>
            </div>
            <div className="price-card">
              <div className="price-card-top">
                <span>THE FOUNDING OFFER</span>
                <span className="price-pill">ONE-TIME PRICE</span>
              </div>
              <h3>Your reputation, on display.</h3>
              <div className="price">
                <span>$</span>99<small>USD · paid once</small>
              </div>
              <p className="price-scope">
                One business. One website. All the good stuff.
              </p>
              <div className="price-inclusions">
                {[
                  "All 5 review widget formats",
                  "Custom colors and responsive layouts",
                  "12 months of automatic Google review syncing",
                  "Simple copy-and-paste installation",
                  "Unlimited widget views on your website",
                ].map((x) => (
                  <Check key={x}>{x}</Check>
                ))}
              </div>
              <CTA onClick={() => buy()}>Get the founding price</CTA>
              <div className="renewal-note">
                <b>No automatic renewal. No surprises.</b>
                <p>
                  After year one, continued syncing is optional for a small
                  annual fee. Renewal pricing will be shared before you decide.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="reassurance wrap">
          {[
            [
              "◇",
              "Your reviews stay yours.",
              "Original customer reviews. Always attributed to Google.",
            ],
            [
              "↔",
              "Made for your real website.",
              "Responsive widgets that fit the way you already work.",
            ],
            [
              "♡",
              "One clear commitment.",
              "$99 today. You choose whether to renew syncing later.",
            ],
          ].map(([icon, title, text]) => (
            <article key={title}>
              <span>{icon}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="faq-section section wrap" id="faq">
          <div>
            <span className="eyebrow">A FEW GOOD QUESTIONS</span>
            <h2>Glad you asked.</h2>
            <p>Simple product. Straight answers.</p>
          </div>
          <div className="faqs">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta wrap">
          <div className="final-stars">★★★★★</div>
          <span className="eyebrow">YOU’VE ALREADY DONE THE HARD PART.</span>
          <h2>
            Great reviews.
            <br />
            Meet your next customer.
          </h2>
          <p>
            Put the trust you’ve earned where it can do more for your business.
          </p>
          <CTA onClick={() => buy()}>Put my reviews to work — $99</CTA>
          <span className="final-note">
            One business. All five widgets. A whole year of syncing.
          </span>
        </section>
      </main>
      <footer className="footer wrap">
        <div>
          <Logo />
          <p>A little social proof goes a long way.</p>
        </div>
        <div className="footer-right">
          <div>
            <a href="#playground">Widgets</a>
            <a href="#pricing">Pricing</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
          <small>
            © {new Date().getFullYear()} ReviewKit. Independent of Google LLC.
          </small>
        </div>
      </footer>
      <div className="mobile-sticky">
        <div>
          <b>
            $99 <small>once</small>
          </b>
          <span>Founding price · 12 months syncing</span>
        </div>
        <CTA onClick={() => buy()}>Get ReviewKit</CTA>
      </div>
      <dialog
        ref={dialog}
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
        aria-labelledby="dialog-title"
      >
        <button
          className="dialog-close"
          onClick={() => setModal(null)}
          aria-label="Close dialog"
        >
          ✕
        </button>
        {modal === "review" ? (
          <>
            <span className="eyebrow">REVIEW BUTTON PREVIEW</span>
            <h2 id="dialog-title">Make the next review easy.</h2>
            <p>
              On your website, this button opens your business’s Google review
              page. This preview uses a fictional business, so it won’t submit a
              review.
            </p>
            <button className="button primary" onClick={() => setModal(null)}>
              Back to the widgets{" "}
            </button>
          </>
        ) : modal === "privacy" ? (
          <>
            <span className="eyebrow">YOUR PRIVACY</span>
            <h2 id="dialog-title">A simple, private preview.</h2>
            <p>
              Business searches are sent to Google Places to find the business
              and retrieve available reviews. Review content is not stored by
              this page. Widget style preferences and the Place ID are saved in
              this browser’s session when you continue to checkout.
            </p>
            <p>
              This landing page does not include advertising pixels, analytics
              trackers, or marketing cookies. Hosting providers may process
              technical request data to deliver the page.
            </p>
            <p>
              If you proceed to a connected checkout, the payment provider’s
              privacy policy applies to the details you enter there.
            </p>
          </>
        ) : (
          <>
            <span className="eyebrow">THE REVIEWKIT FOUNDING OFFER</span>
            <h2 id="dialog-title">
              A better first impression.
              <br />
              For $99.
            </h2>
            <p>
              One business, one website, all five widgets, and 12 months of
              automatic review syncing.
            </p>
            <div className="checkout-status">
              <span>◷</span>
              <div>
                <b>Checkout is not open yet.</b>
                <p>
                  Payments aren’t enabled on this preview. No payment or
                  reservation has been made.
                </p>
              </div>
            </div>
            <button
              className="button primary"
              onClick={() => {
                setModal(null);
                document
                  .getElementById("playground")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore the widgets{" "}
            </button>
            <small className="modal-fine">
              Optional syncing renewal after year one. Pricing will be shared
              before renewal. No automatic charges.
            </small>
          </>
        )}
      </dialog>
    </>
  );
}
