"use client";
import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import WidgetBuilder from "./components/widget-builder";
import ReviewWidget from "./components/review-widget";
import { trackWaitlistLead } from "./components/meta-pixel-track";
import { samplePlace } from "../lib/widget-sample";

function MobileWidgetCallout() {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  const measure = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth > 760) {
      setPos(null);
      return;
    }
    const stack = document.querySelector(
      ".hero-visual-stack",
    ) as HTMLElement | null;
    const reviews = document.querySelector(
      ".example-reviews",
    ) as HTMLElement | null;
    if (!stack || !reviews) {
      setPos(null);
      return;
    }
    const stackR = stack.getBoundingClientRect();
    const reviewsR = reviews.getBoundingClientRect();
    // Sit just under the reviews block, arrow pointing up into it.
    const top = reviewsR.bottom - stackR.top + 8;
    const right = Math.max(6, stackR.right - reviewsR.right + 4);
    setPos({ top, right });
  }, []);

  useEffect(() => {
    measure();
    const stack = document.querySelector(".hero-visual-stack");
    const reviews = document.querySelector(".example-reviews");
    const ro = new ResizeObserver(() => measure());
    if (stack) ro.observe(stack);
    if (reviews) ro.observe(reviews);
    ro.observe(document.documentElement);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 160);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [measure]);

  if (!pos) return null;

  return (
    <div
      className="mobile-widget-callout"
      aria-hidden="true"
      style={{ top: pos.top, right: pos.right }}
    >
      <svg
        className="mobile-widget-callout-arrow"
        viewBox="0 0 72 56"
        fill="none"
        overflow="visible"
      >
        <path
          d="M48 50c8-10 10-22 2-32-6-8-18-12-30-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 20 L20 6 L28 20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Our Google Reviews widget</span>
    </div>
  );
}

function ExampleCarousel() {
  const [slide, setSlide] = useState(0);
  return <ReviewWidget
    name={samplePlace.displayName!.text!}
    rating={samplePlace.rating}
    count={samplePlace.userRatingCount ?? 0}
    reviews={samplePlace.reviews ?? []}
    styleName="signature"
    format={0}
    accent="#1a73e8"
    slide={slide}
    onSlide={setSlide}
    mapsHref="https://www.google.com/maps"
  />;
}

const faqs = [
  [
    "What do I need to use GoogleReviewsKit?",
    "A business with a Google Business Profile, existing Google reviews, and a website where you can add an embed snippet. You don’t need a new website.",
  ],
  [
    "Will it work with my website?",
    "GoogleReviewsKit is designed for websites that support custom HTML or embed blocks, including WordPress, Webflow, Squarespace, Wix, Shopify, and custom sites. Some platforms require a paid plan to add custom code.",
  ],
  [
    "How do my Google reviews get onto my website?",
    "Search for your business, select it from the results, choose a widget, and add the embed snippet to your site. GoogleReviewsKit displays the reviews Google makes available and keeps them updated while syncing is active. Sample widgets are clearly labeled.",
  ],
  [
    "What’s the difference between the two plans?",
    "Start free and sync for $14.99/month, or pay $99 once and sync for $4.99/month. Both include the same widgets and customization. Cancel syncing anytime.",
  ],
  [
    "Can I match the widgets to my brand?",
    "Yes. Choose from five widget formats and customize the colors and layout to fit your website. All formats are responsive, so your reviews look good on phones, tablets, and desktops.",
  ],
  [
    "Is GoogleReviewsKit affiliated with Google?",
    "No. GoogleReviewsKit is an independent product. Google and its trademarks belong to Google LLC. Your customers’ reviews remain their original reviews on Google.",
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
    <a className="logo" href="#" aria-label="GoogleReviewsKit home">
      <img
        className="logo-mark"
        src="/icons/icon-logo.png"
        alt=""
        width={38}
        height={38}
      />
      <span className="logo-wordmark">
        googlereviewskit
        <span className="logo-dot">.</span>
      </span>
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
function CTA({
  children = "Get GoogleReviewsKit",
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
const LAUNCH_DISCOUNT = "20%";

export default function GoogleReviewsKit({
  checkoutUrl = "",
  variant = "default",
}: {
  checkoutUrl?: string;
  variant?: "default" | "pre-release";
}) {
  const isPreRelease = variant === "pre-release";
  const [after, setAfter] = useState(true),
    [menu, setMenu] = useState(false),
    [modal, setModal] = useState<
      "checkout" | "privacy" | "review" | "waitlist" | null
    >(null),
    [waitlistEmail, setWaitlistEmail] = useState(""),
    [waitlistPhone, setWaitlistPhone] = useState(""),
    [waitlistWebsite, setWaitlistWebsite] = useState(""),
    [waitlistStatus, setWaitlistStatus] = useState<
      "idle" | "submitting" | "done" | "error"
    >("idle"),
    [waitlistError, setWaitlistError] = useState("");
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

  function clearWaitlistError() {
    if (waitlistStatus === "error") {
      setWaitlistStatus("idle");
      setWaitlistError("");
    }
  }

  function openWaitlist() {
    setWaitlistStatus("idle");
    setWaitlistError("");
    setModal("waitlist");
  }

  async function submitWaitlist(e: FormEvent) {
    e.preventDefault();
    const email = waitlistEmail.trim();
    const phone = waitlistPhone.trim();
    const website = waitlistWebsite.trim();
    if (!email && !phone) {
      setWaitlistStatus("error");
      setWaitlistError("Email or phone is required.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWaitlistStatus("error");
      setWaitlistError("Enter a valid email address.");
      return;
    }
    setWaitlistStatus("submitting");
    setWaitlistError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          website,
          source: "pre-release",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setWaitlistStatus("error");
        setWaitlistError(data.error || "Something went wrong. Try again.");
        return;
      }
      if (email) trackWaitlistLead();
      setWaitlistStatus("done");
      setWaitlistEmail("");
      setWaitlistPhone("");
      setWaitlistWebsite("");
    } catch {
      setWaitlistStatus("error");
      setWaitlistError("Something went wrong. Try again.");
    }
  }

  async function buy(config?: {
    placeId?: string;
    placeName?: string;
    accent?: string;
    style?: string;
    format?: number;
    font?: string;
    radius?: string;
    plan?: "founding" | "monthly";
  }) {
    if (isPreRelease) {
      if (config) {
        try {
          sessionStorage.setItem(
            "googlereviewskit-widget-draft",
            JSON.stringify(config),
          );
        } catch {}
      }
      openWaitlist();
      return;
    }
    if (config) {
      try {
        sessionStorage.setItem(
          "googlereviewskit-widget-draft",
          JSON.stringify(config),
        );
      } catch {}
    }
    const plan = config?.plan;
    if (!plan) {
      document
        .getElementById("pricing")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (checkoutUrl && /^https:\/\//.test(checkoutUrl)) {
      window.location.assign(checkoutUrl);
      return;
    }
    const draft =
      config?.placeId && /^[a-zA-Z0-9_-]{5,255}$/.test(config.placeId)
        ? {
            placeId: config.placeId,
            placeName: config.placeName,
            accent: config.accent || "#1a73e8",
            style: config.style || "signature",
            format: typeof config.format === "number" ? config.format : 0,
            font: config.font || "modern",
            radius: config.radius || "soft",
          }
        : null;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, draft }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url && /^https:\/\//.test(data.url)) {
        window.location.assign(data.url);
        return;
      }
    } catch {}
    setModal("checkout");
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
          <div className="announcement">
            <span className="status-dot" />
            {isPreRelease ? (
              <>
                Early access waitlist.{" "}
                <button type="button" className="announcement-link" onClick={openWaitlist}>
                  Join now — {LAUNCH_DISCOUNT} off at launch
                </button>
              </>
            ) : (
              <>
                Two simple plans.{" "}
                <a href="#pricing">free + $14.99/mo</a> or{" "}
                <a href="#pricing">$99 + $4.99/mo</a>
              </>
            )}
          </div>
          <header className="header wrap">
            <Logo />
            <nav
              aria-label="Main navigation"
              className={menu ? "nav open" : "nav"}
            >
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
            {isPreRelease ? (
              <button
                type="button"
                className="button primary nav-cta"
                onClick={openWaitlist}
              >
                Join waitlist
              </button>
            ) : (
              <a className="button primary nav-cta" href="#playground">
                Create widget
              </a>
            )}
            <button
              className="menu-toggle"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? "✕" : "☰"}
            </button>
          </header>
        <div className="site-fold">
          <section className="hero wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-stars">★★★★★</span> GOOD REVIEWS DESERVE TO
              BE SEEN
            </span>
            <h1>
              <span className="hero-title-line">You earned</span>
              <span className="hero-title-line">the trust.</span>
              <span className="hero-title-line hero-title-accent">
                Show it off.
              </span>
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
              {isPreRelease ? (
                <>
                  <CTA onClick={openWaitlist}>
                    Join waitlist — {LAUNCH_DISCOUNT} off
                  </CTA>
                  <a href="#playground" className="demo-link">
                    Try the widgets
                  </a>
                </>
              ) : (
                <>
                  <a href="#playground" className="button primary">
                    Try your widget for free
                  </a>
                  <a href="#pricing" className="demo-link">
                    See pricing
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-stack">
            <MobileWidgetCallout />
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
                  <img
                    className="clinic-art"
                    src="/icons/hero-dental.png"
                    alt=""
                    width={168}
                    height={230}
                  />
                </div>
                <div className="example-reviews">
                  <span className="demo-data-note">Fictional demo data</span>
                  <ExampleCarousel />
                </div>
              </div>
            </div>
            </div>
          </div>
          </section>
        </div>
        <WidgetBuilder
          onBuy={buy}
          ctaLabel={
            isPreRelease
              ? `Join waitlist — ${LAUNCH_DISCOUNT} off`
              : "Add to my website"
          }
        />
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
                "/icons/icon-trust.png",
                "Trust, before the first hello.",
                "Give visitors the reassurance of real customer experiences, right when they’re deciding.",
              ],
              [
                "/icons/icon-onsite.png",
                "Keep the good stuff on your site.",
                "No extra tabs. No trip back to Google. Put your reputation next to your booking or contact button.",
              ],
              [
                "/icons/icon-sync.png",
                "Fresh proof. Without the upkeep.",
                "New reviews show up automatically with active syncing. Set it up, then get back to your business.",
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <span className="feature-icon">
                  <img src={icon} alt="" width={52} height={52} />
                </span>
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
            {isPreRelease ? (
              <button type="button" className="text-link" onClick={openWaitlist}>
                Put your reviews to work{" "}
              </button>
            ) : (
              <a className="text-link" href="#pricing">
                Put your reviews to work{" "}
              </a>
            )}
          </div>
          <div>
            <div
              className="comparison-switch"
              role="group"
              aria-label="Website comparison"
            >
              <button aria-pressed={!after} onClick={() => setAfter(false)}>
                Before GoogleReviewsKit
              </button>
              <button aria-pressed={after} onClick={() => setAfter(true)}>
                With GoogleReviewsKit ★
              </button>
            </div>
            <div className="comparison-site">
              <span className="comparison-logo">
                OAK & MAPLE <small>DENTAL STUDIO</small>
              </span>
              <h3>
                Your smile.
                <br />
                In good hands.
              </h3>
              <p>Thoughtful dental care for the whole family.</p>
              <span className="example-button">Book a visit</span>
              {after ? (
                <div className="comparison-reviews">
                  <span className="demo-data-note">Fictional demo data</span>
                  <ExampleCarousel />
                </div>
              ) : (
                <div className="comparison-proof">
                  <span className="empty-proof">
                    A promise is good.<br />A little proof is better.
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="how-it-works section wrap" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">LESS SETUP. MORE SHOWING OFF.</span>
            <h2>
              From Google to{" "}
              <br className="mobile-break" />
              <span className="heading-accent">your website.</span>
              <br />
              In three simple steps.
            </h2>
          </div>
          <div className="steps">
            <article>
              <div className="step-number">
                01<span>↗</span>
              </div>
              <h3>Find your business.</h3>
              <p>
                Search by name and city, then pick your activity from the list.
                That’s it — no Google login required.
              </p>
              <div className="step-visual">
                <Google />
                <span>Your business</span>
                <span className="connected">✓ Selected</span>
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
                SIMPLE PRICING. SAME WIDGETS.
              </span>
              <h2>
                Pick the plan that
                <br />
                <em>fits how you work.</em>
              </h2>
              <p>
                Same widgets. Same customization.
                <br />
                Start free or choose pay-up-front.
              </p>
              <div className="founder-note">
                <img
                  className="founder-mark"
                  src="/icons/icon-founder.png"
                  alt=""
                  width={52}
                  height={52}
                />
                <div>
                  <h3>Built for small businesses.</h3>
                  <p>
                    Both plans include all five widget formats, brand colors,
                    and automatic Google review syncing for one business on one
                    website.
                  </p>
                </div>
              </div>
            </div>
            <div className="price-cards">
              <div className="price-card featured">
                <div className="price-card-top">
                  <span>START FREE</span>
                </div>
                <h3>Free setup + monthly</h3>
                <div className="price">
                  <span>$</span>0
                </div>
                <p className="price-scope">
                  Then <strong>$14.99/month</strong>
                </p>
                <div className="price-inclusions">
                  {[
                    "All 5 review widget formats",
                    "Custom colors and layouts",
                    "Automatic Google review syncing",
                    "Copy-and-paste installation",
                  ].map((x) => (
                    <Check key={x}>{x}</Check>
                  ))}
                </div>
                <CTA
                  onClick={() =>
                    isPreRelease ? openWaitlist() : buy({ plan: "monthly" })
                  }
                >
                  {isPreRelease
                    ? `Join waitlist — ${LAUNCH_DISCOUNT} off`
                    : "Get free + $14.99/mo"}
                </CTA>
              </div>
              <div className="price-card">
                <div className="price-card-top">
                  <span>PAY ONCE</span>
                </div>
                <h3>Setup + low monthly</h3>
                <div className="price">
                  <span>$</span>99
                </div>
                <p className="price-scope">
                  Then <strong>$4.99/month</strong>
                </p>
                <div className="price-inclusions">
                  {[
                    "All 5 review widget formats",
                    "Custom colors and layouts",
                    "Automatic Google review syncing",
                    "Copy-and-paste installation",
                  ].map((x) => (
                    <Check key={x}>{x}</Check>
                  ))}
                </div>
                <CTA
                  onClick={() =>
                    isPreRelease ? openWaitlist() : buy({ plan: "founding" })
                  }
                >
                  {isPreRelease
                    ? `Join waitlist — ${LAUNCH_DISCOUNT} off`
                    : "Get $99 + $4.99/mo"}
                </CTA>
              </div>
            </div>
          </div>
        </section>
        <section className="reassurance wrap">
          {[
            [
              "/icons/icon-yours.png",
              "Your reviews stay yours.",
              "Original customer reviews. Always attributed to Google.",
            ],
            [
              "/icons/icon-website.png",
              "Made for your real website.",
              "Responsive widgets that fit the way you already work.",
            ],
            [
              "/icons/icon-heart.png",
              "Cancel anytime.",
              "Syncing is month to month. Keep the widgets as long as you need them.",
            ],
          ].map(([icon, title, text]) => (
            <article key={title}>
              <img
                className="reassure-icon"
                src={icon}
                alt=""
                width={44}
                height={44}
              />
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
          <CTA onClick={() => (isPreRelease ? openWaitlist() : buy())}>
            {isPreRelease
              ? `Join waitlist — ${LAUNCH_DISCOUNT} off`
              : "Choose a plan"}
          </CTA>
          <span className="final-note">
            {isPreRelease
              ? `Early access + ${LAUNCH_DISCOUNT} off when we launch. Same widgets either way.`
              : "Free + $14.99/mo, or $99 + $4.99/mo. Same widgets either way."}
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
            © {new Date().getFullYear()} GoogleReviewsKit. Independent of Google
            LLC.
          </small>
        </div>
      </footer>
      <div className="mobile-sticky">
        <div>
          {isPreRelease ? (
            <>
              <b>
                <span className="sticky-free">{LAUNCH_DISCOUNT} off</span>
              </b>
              <span>Early access waitlist</span>
            </>
          ) : (
            <>
              <b>
                From <span className="sticky-free">free</span>
              </b>
              <span>Or $99 + $4.99/mo</span>
            </>
          )}
        </div>
        <CTA onClick={() => (isPreRelease ? openWaitlist() : buy())}>
          {isPreRelease ? "Join waitlist" : "Get GoogleReviewsKit"}
        </CTA>
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
              privacy policy applies to the details you enter there. Full details
              are in our{" "}
              <a href="/privacy">Privacy Policy</a> (GDPR).
            </p>
          </>
        ) : modal === "waitlist" ? (
          waitlistStatus === "done" ? (
            <>
              <span className="eyebrow">YOU’RE ON THE LIST</span>
              <h2 id="dialog-title">
                Thanks.
                <br />
                We’ll be in touch.
              </h2>
              <p>
                You’re locked in for early access and{" "}
                <strong>{LAUNCH_DISCOUNT} off</strong> when GoogleReviewsKit
                launches.
              </p>
              <div className="checkout-status">
                <span>✓</span>
                <div>
                  <b>Launch discount reserved.</b>
                  <p>
                    We’ll email you when it’s ready — no payment today.
                  </p>
                </div>
              </div>
              <button className="button primary" onClick={() => setModal(null)}>
                Back to the page
              </button>
            </>
          ) : (
            <>
              <span className="eyebrow">EARLY ACCESS + {LAUNCH_DISCOUNT} OFF</span>
              <h2 id="dialog-title">
                Join the waitlist.
                <br />
                Save at launch.
              </h2>
              <p>
                Leave your email or phone, and your website. We’ll invite you
                first — with <strong>{LAUNCH_DISCOUNT} off</strong> when
                checkout opens.
              </p>
              <form className="waitlist-form" onSubmit={submitWaitlist}>
                <div className="waitlist-field">
                  <label htmlFor="waitlist-email">Email</label>
                  <input
                    id="waitlist-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@business.com"
                    value={waitlistEmail}
                    onChange={(e) => {
                      setWaitlistEmail(e.target.value);
                      clearWaitlistError();
                    }}
                    disabled={waitlistStatus === "submitting"}
                  />
                </div>
                <div className="waitlist-field">
                  <label htmlFor="waitlist-phone">Phone</label>
                  <input
                    id="waitlist-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="+39 333 000 0000"
                    value={waitlistPhone}
                    onChange={(e) => {
                      setWaitlistPhone(e.target.value);
                      clearWaitlistError();
                    }}
                    disabled={waitlistStatus === "submitting"}
                  />
                </div>
                <p className="waitlist-hint">Email or phone — at least one.</p>
                <div className="waitlist-field">
                  <label htmlFor="waitlist-website">Website</label>
                  <input
                    id="waitlist-website"
                    type="text"
                    name="website"
                    autoComplete="url"
                    inputMode="url"
                    placeholder="https://yourbusiness.com"
                    value={waitlistWebsite}
                    onChange={(e) => {
                      setWaitlistWebsite(e.target.value);
                      clearWaitlistError();
                    }}
                    disabled={waitlistStatus === "submitting"}
                  />
                </div>
                {waitlistError ? (
                  <p className="waitlist-error" role="alert">
                    {waitlistError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="button primary"
                  disabled={waitlistStatus === "submitting"}
                >
                  {waitlistStatus === "submitting"
                    ? "Joining…"
                    : `Join waitlist — ${LAUNCH_DISCOUNT} off`}
                </button>
              </form>
              <small className="modal-fine">
                No payment today. We only use this to reach you at launch.
              </small>
            </>
          )
        ) : (
          <>
            <span className="eyebrow">CHOOSE YOUR PLAN</span>
            <h2 id="dialog-title">
              Same widgets.
              <br />
              Two ways to pay.
            </h2>
            <p>
              Start free + $14.99/month, or $99 once + $4.99/month. One business,
              one website, all five widgets.
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
              Syncing is billed monthly. Cancel anytime. No automatic annual
              lock-in.
            </small>
          </>
        )}
      </dialog>
    </>
  );
}
