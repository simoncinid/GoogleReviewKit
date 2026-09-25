"use client";
/* eslint-disable @next/next/no-img-element -- Google attribution and author photos are served unmodified. */
import { useRef, useState } from "react";
import type { Place, GoogleReview } from "../../lib/places";
import { safeGoogleUrl } from "../../lib/places";
const sample: Place = {
  id: "example",
  displayName: { text: "Oak & Maple Dental" },
  formattedAddress: "Austin, Texas · Sample business",
  rating: 4.9,
  userRatingCount: 128,
  reviews: [
    {
      rating: 5,
      authorAttribution: { displayName: "Sarah Mitchell" },
      relativePublishTimeDescription: "2 weeks ago",
      text: {
        text: "Finally, a dentist I actually look forward to visiting. The team made me feel at home from the moment I walked in. Thoughtful care, without the rush.",
      },
    },
    {
      rating: 5,
      authorAttribution: { displayName: "James Robinson" },
      relativePublishTimeDescription: "1 month ago",
      text: {
        text: "They explained every step, answered all my questions, and made the whole experience so easy. This is what great care should feel like.",
      },
    },
    {
      rating: 5,
      authorAttribution: { displayName: "Emily Wilson" },
      relativePublishTimeDescription: "1 month ago",
      text: {
        text: "So glad we found this place. You can tell they genuinely care about their patients. Our whole family comes here now.",
      },
    },
  ],
};
const formats = [
  "Carousel",
  "Review grid",
  "Floating badge",
  "Trust badge",
  "Review button",
];
export function RatingStars({ rating = 5 }: { rating?: number }) {
  return (
    <span
      className="rating-stars"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span aria-hidden="true">★★★★★</span>
      <span
        aria-hidden="true"
        style={{ width: `${(Math.max(0, Math.min(5, rating)) / 5) * 100}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
function GoogleAttribution() {
  return (
    <span className="google-attribution" translate="no">
      <img
        src="/google-maps-attribution.svg"
        alt="Google Maps"
        height={17}
        width={87}
      />
    </span>
  );
}
function ReviewCard({
  review,
  index,
  live,
}: {
  review: GoogleReview;
  index: number;
  live: boolean;
}) {
  const author = review.authorAttribution;
  const name = author?.displayName || "Google reviewer";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const authorUrl = safeGoogleUrl(author?.uri);
  const reviewUrl = safeGoogleUrl(review.googleMapsUri);
  const photo = safeGoogleUrl(author?.photoUri);
  return (
    <article className="signature-card">
      <div className="card-top">
        <RatingStars rating={review.rating ?? 0} />
        <span className="review-source">Google review</span>
      </div>
      <span className="editorial-quote" aria-hidden="true">
        “
      </span>
      <p className="review-body">
        {review.originalText?.text ||
          review.text?.text ||
          "This customer left a rating without written feedback."}
      </p>
      <div className="card-author">
        {photo ? (
          <img
            className="author-avatar"
            src={photo}
            alt=""
            loading="lazy"
            width={42}
            height={42}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className={`author-avatar tone-${index % 3}`}>{initials}</span>
        )}
        <div>
          {authorUrl ? (
            <a href={authorUrl} target="_blank" rel="noreferrer">
              {name}
            </a>
          ) : (
            <strong>{name}</strong>
          )}
          <small>
            {review.relativePublishTimeDescription || "Google reviewer"}
          </small>
          {review.visitDate?.year && review.visitDate?.month && (
            <small>
              Visited {review.visitDate.month}/{review.visitDate.year}
            </small>
          )}
        </div>
        <span className="author-mark" aria-hidden="true">
          G
        </span>
      </div>
      {live && reviewUrl && (
        <a
          className="original-review"
          href={reviewUrl}
          target="_blank"
          rel="noreferrer"
        >
          Read on Google Maps
        </a>
      )}
    </article>
  );
}
export default function WidgetBuilder({
  onBuy,
}: {
  onBuy: (config?: {
    placeId: string;
    accent: string;
    style: string;
    format: number;
    font: string;
    radius: string;
  }) => void;
}) {
  const [place, setPlace] = useState<Place>(sample),
    [query, setQuery] = useState(""),
    [results, setResults] = useState<Place[]>([]),
    [status, setStatus] = useState<
      "idle" | "searching" | "choosing" | "loading" | "empty" | "error"
    >("idle"),
    [error, setError] = useState("");
  const [format, setFormat] = useState(0),
    [accent, setAccent] = useState("#17513f"),
    [style, setStyle] = useState("signature"),
    [font, setFont] = useState("modern"),
    [radius, setRadius] = useState("soft"),
    [slide, setSlide] = useState(0),
    [device, setDevice] = useState("desktop");
  const [buttonNotice, setButtonNotice] = useState(false);
  const requestId = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const live = place.id !== "example";
  const reviews = place.reviews || [];
  const name = place.displayName?.text || "Your business";
  const rating = place.rating;
  const count = place.userRatingCount ?? 0;
  async function search() {
    if (query.trim().length < 3) {
      setError("Enter a business name and city — at least 3 characters.");
      setStatus("error");
      return;
    }
    const id = ++requestId.current;
    abort.current?.abort();
    abort.current = new AbortController();
    setStatus("searching");
    setError("");
    setResults([]);
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
        signal: abort.current.signal,
      });
      const data = (await response.json()) as {
        places?: Place[];
        error?: string;
      };
      if (id !== requestId.current) return;
      if (!response.ok)
        throw new Error(
          data.error || "Search is unavailable. Please try again.",
        );
      setResults(data.places || []);
      setStatus(data.places?.length ? "choosing" : "empty");
    } catch (e) {
      if (id !== requestId.current) return;
      setStatus("error");
      setError(
        e instanceof Error
          ? e.message
          : "Search is unavailable. Please try again.",
      );
    }
  }
  async function selectPlace(id: string) {
    const current = ++requestId.current;
    abort.current?.abort();
    abort.current = new AbortController();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: id }),
        signal: abort.current.signal,
      });
      const data = (await response.json()) as Place & { error?: string };
      if (current !== requestId.current) return;
      if (!response.ok)
        throw new Error(data.error || "Could not load this business.");
      setPlace(data);
      setResults([]);
      setSlide(0);
      setStatus("idle");
      setButtonNotice(false);
      stage.current?.focus({ preventScroll: true });
    } catch (e) {
      if (current !== requestId.current) return;
      setStatus("error");
      setError(
        e instanceof Error ? e.message : "Could not load this business.",
      );
    }
  }
  function reset() {
    ++requestId.current;
    abort.current?.abort();
    setPlace(sample);
    setResults([]);
    setStatus("idle");
    setError("");
    setQuery("");
    setSlide(0);
    setButtonNotice(false);
  }
  const busy = status === "searching" || status === "loading";
  const total = Math.max(1, reviews.length);
  const displayed =
    format === 0
      ? reviews.slice(slide).concat(reviews.slice(0, slide)).slice(0, 3)
      : reviews;
  function reviewButton() {
    const uri = safeGoogleUrl(place.googleMapsLinks?.writeAReviewUri);
    if (uri) window.open(uri, "_blank", "noopener,noreferrer");
    else setButtonNotice(true);
  }
  return (
    <section className="playground section" id="playground">
      <div className="wrap">
        <div className="section-heading">
          <span className="free-label">TRY IT HERE. FOR FREE.</span>
          <h2>
            Your reviews.
            <br />
            <span className="heading-accent">Unmistakably your brand.</span>
          </h2>
          <p>
            Find your business. Pick your look. See your widget come to life.
          </p>
          <span className="free-note">
            No account. No credit card. Just your next great first impression.
          </span>
        </div>
        <div className="builder">
          <div className="business-search">
            <div className="builder-step">
              <span>01</span>
              <div>
                <h3>Find your business</h3>
                <p>Your business name + city works best.</p>
              </div>
              <GoogleAttribution />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void search();
              }}
            >
              <label className="sr-only" htmlFor="business-search">
                Business name and city
              </label>
              <div className="search-field">
                <input
                  id="business-search"
                  type="search"
                  autoComplete="off"
                  placeholder="e.g. Mario Rossi Dentist Miami"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (status === "choosing" || status === "empty") {
                      setResults([]);
                      setStatus("idle");
                    }
                  }}
                  maxLength={160}
                  aria-describedby="search-help"
                  disabled={busy}
                />
                <button type="submit" disabled={busy}>
                  {status === "searching"
                    ? "Searching…"
                    : status === "loading"
                      ? "Loading…"
                      : "Find my business"}
                </button>
              </div>
              <p id="search-help">
                Search Google or{" "}
                <button type="button" className="inline-button" onClick={reset}>
                  try a sample business
                </button>
                .
              </p>
            </form>
            <div aria-live="polite" className="search-status">
              {status === "error" && <p className="search-error">{error}</p>}
              {status === "empty" && (
                <p>
                  No matches yet. Try a more specific business name and city.
                </p>
              )}
              {status === "loading" && (
                <p>Getting the reviews for your selected business…</p>
              )}
            </div>
            {results.length > 0 && (
              <div className="search-results">
                <p>Choose your business</p>
                <ul>
                  {results.map((result) => (
                    <li key={result.id}>
                      <button
                        onClick={() => void selectPlace(result.id)}
                        disabled={busy}
                      >
                        <span className="result-monogram">
                          {result.displayName?.text?.[0] || "B"}
                        </span>
                        <span>
                          <strong>{result.displayName?.text}</strong>
                          <small>{result.formattedAddress}</small>
                        </span>
                        <span className="result-select">Select</span>
                      </button>
                      {result.attributions?.map((a, i) => (
                        <small className="provider-attribution" key={i}>
                          {a.providerUri ? (
                            <a
                              href={safeGoogleUrl(a.providerUri)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {a.provider}
                            </a>
                          ) : (
                            a.provider
                          )}
                        </small>
                      ))}
                    </li>
                  ))}
                </ul>
                <GoogleAttribution />
              </div>
            )}
          </div>
          <div className="customize-bar">
            <div className="builder-step">
              <span>02</span>
              <div>
                <h3>Make it yours</h3>
                <p>Real customization. Not just a color swap.</p>
              </div>
            </div>
            <span className="included-label">EVERY STYLE INCLUDED</span>
          </div>
          <div className="builder-workspace">
            <aside className="style-controls" aria-label="Widget customization">
              <fieldset>
                <legend>Choose your style</legend>
                <div className="style-options">
                  {[
                    ["signature", "Signature", "Clean. Confident. Yours."],
                    ["editorial", "Editorial", "A little more character."],
                    ["contrast", "Contrast", "Bold, with nothing to hide."],
                  ].map(([id, label, desc]) => (
                    <button
                      key={id}
                      className={`style-option ${id}`}
                      aria-pressed={style === id}
                      onClick={() => setStyle(id)}
                    >
                      <span className="style-thumbnail">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span>
                        <b>{label}</b>
                        <small>{desc}</small>
                      </span>
                      <span className="style-check">
                        {style === id ? "✓" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>
                  Brand color <span>{accent.toUpperCase()}</span>
                </legend>
                <div className="brand-colors">
                  {["#17513f", "#3157ac", "#9d4230", "#29272c"].map((c, i) => (
                    <button
                      key={c}
                      style={{ background: c }}
                      aria-label={`Use ${["forest", "blue", "terracotta", "ink"][i]}`}
                      aria-pressed={accent === c}
                      onClick={() => setAccent(c)}
                    >
                      {accent === c ? "✓" : ""}
                    </button>
                  ))}
                  <label
                    className="custom-color"
                    title="Choose any brand color"
                  >
                    <span>+</span>
                    <input
                      type="color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      aria-label="Custom brand color"
                    />
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Typography</legend>
                <div className="segmented">
                  {["modern", "classic"].map((f) => (
                    <button
                      key={f}
                      aria-pressed={font === f}
                      onClick={() => setFont(f)}
                    >
                      {f === "modern" ? "Modern" : "Classic"}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Corners</legend>
                <div className="segmented">
                  {["sharp", "soft", "round"].map((r) => (
                    <button
                      key={r}
                      aria-pressed={radius === r}
                      onClick={() => setRadius(r)}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <span className="customization-note">
                Your brand doesn’t look like everyone else’s.
                <br />
                Your reviews shouldn’t either.
              </span>
            </aside>
            <div className="preview-workspace">
              <div className="preview-heading">
                <span>
                  <i /> LIVE PREVIEW
                </span>
                <div className="device-toggle" aria-label="Preview width">
                  {["desktop", "mobile"].map((d) => (
                    <button
                      key={d}
                      aria-pressed={device === d}
                      onClick={() => setDevice(d)}
                    >
                      {d === "desktop" ? "Desktop" : "Mobile"}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="format-tabs"
                role="tablist"
                aria-label="Widget format"
              >
                {formats.map((f, i) => (
                  <button
                    key={f}
                    id={`format-${i}`}
                    role="tab"
                    aria-controls="live-widget"
                    aria-selected={format === i}
                    tabIndex={format === i ? 0 : -1}
                    onClick={() => setFormat(i)}
                    onKeyDown={(e) => {
                      let next = i;
                      if (e.key === "ArrowRight") next = (i + 1) % 5;
                      else if (e.key === "ArrowLeft") next = (i + 4) % 5;
                      else if (e.key === "Home") next = 0;
                      else if (e.key === "End") next = 4;
                      else return;
                      e.preventDefault();
                      setFormat(next);
                      document.getElementById(`format-${next}`)?.focus();
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div
                className={`live-widget style-${style} font-${font} radius-${radius} device-${device}`}
                id="live-widget"
                ref={stage}
                tabIndex={-1}
                role="tabpanel"
                aria-labelledby={`format-${format}`}
                style={{ "--brand": accent } as React.CSSProperties}
              >
                <div className="widget-identity">
                  <div>
                    <span className="widget-kicker">
                      {live
                        ? "REAL PEOPLE. REAL EXPERIENCES."
                        : "A LITTLE LOCAL LOVE."}
                    </span>
                    <h3>{name}</h3>
                    <p>{place.formattedAddress}</p>
                  </div>
                  <span className={`data-tag ${live ? "real" : ""}`}>
                    {live ? "GOOGLE REVIEWS" : "SAMPLE BUSINESS"}
                  </span>
                </div>
                {(format === 0 || format === 1) && (
                  <>
                    <div className="widget-rating-summary">
                      <div className="rating-number">
                        {rating?.toFixed(1) ?? "—"}
                      </div>
                      <div>
                        <RatingStars rating={rating ?? 0} />
                        <p>{count.toLocaleString("en-US")} reviews on Google</p>
                      </div>
                      <span className="summary-caption">
                        A reputation built
                        <br />
                        one customer at a time.
                      </span>
                    </div>
                    {reviews.length ? (
                      <div
                        className={`signature-reviews ${format === 1 ? "as-grid" : ""}`}
                      >
                        {displayed.map((r, i) => (
                          <ReviewCard
                            key={`${r.name || r.authorAttribution?.displayName}-${i}`}
                            review={r}
                            index={i}
                            live={live}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="no-reviews">
                        Google hasn’t returned written reviews for this
                        business. Try a rating badge or choose another business.
                      </div>
                    )}
                    {format === 0 && reviews.length > 1 && (
                      <div className="widget-pagination">
                        <button
                          onClick={() => setSlide((slide - 1 + total) % total)}
                          aria-label="Previous review"
                        >
                          ‹
                        </button>
                        <span>
                          {slide + 1} / {reviews.length}
                        </span>
                        <button
                          onClick={() => setSlide((slide + 1) % total)}
                          aria-label="Next review"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </>
                )}
                {format === 2 && (
                  <div className="floating-stage">
                    <div className="site-placeholder">
                      <span>YOUR WEBSITE</span>
                      <b>First impressions matter.</b>
                      <i />
                      <i />
                    </div>
                    <div className="bold-floating-badge">
                      <span className="badge-google">G</span>
                      <div>
                        <strong>{name}</strong>
                        <span>
                          <b>{rating?.toFixed(1) ?? "—"}</b>
                          <RatingStars rating={rating ?? 0} />
                        </span>
                        <small>
                          {count.toLocaleString("en-US")} Google reviews
                        </small>
                      </div>
                      <span className="badge-stamp">✦</span>
                    </div>
                  </div>
                )}
                {format === 3 && (
                  <div className="trust-badge-stage">
                    <div className="bold-trust-badge">
                      <span className="badge-google">G</span>
                      <div>
                        <b>
                          {rating
                            ? `${rating.toFixed(1)} out of 5`
                            : "Not yet rated"}
                        </b>
                        <RatingStars rating={rating ?? 0} />
                      </div>
                      <span className="trust-count">
                        <strong>{count.toLocaleString("en-US")}</strong>
                        <small>Google reviews</small>
                      </span>
                    </div>
                    <p>
                      A little reassurance. Right next to your call to action.
                    </p>
                  </div>
                )}
                {format === 4 && (
                  <div className="review-invite">
                    <span className="invite-star">✦</span>
                    <h4>
                      Good experiences
                      <br />
                      deserve to be shared.
                    </h4>
                    <p>How was your visit to {name}?</p>
                    <button onClick={reviewButton}>
                      Leave us a Google review
                    </button>
                    {buttonNotice && (
                      <p role="status" className="review-notice">
                        {live
                          ? "A direct review link is unavailable for this business."
                          : "This is a sample. Your live button will open your Google review page."}
                      </p>
                    )}
                  </div>
                )}
                <div className="widget-attribution">
                  {live ? (
                    <GoogleAttribution />
                  ) : (
                    <span className="sample-attribution">
                      ILLUSTRATIVE WIDGET PREVIEW
                    </span>
                  )}
                  {live && safeGoogleUrl(place.googleMapsUri) && (
                    <a
                      href={safeGoogleUrl(place.googleMapsUri)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Google Maps
                    </a>
                  )}
                  {place.attributions?.map((a, i) => (
                    <span key={i}>
                      {a.providerUri ? (
                        <a
                          href={safeGoogleUrl(a.providerUri)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {a.provider}
                        </a>
                      ) : (
                        a.provider
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <p className="preview-disclosure">
                {live
                  ? `Showing ${reviews.length} reviews made available by Google, ordered by relevance. No rating filter is applied. Your full review library connects after purchase.`
                  : "Fictional example reviews. Find your business above to preview your own."}
              </p>
            </div>
          </div>
          <div className="builder-conversion">
            <div>
              <strong>Looks like you. Works for you.</strong>
              <p>All five widgets. Every style. Your own colors.</p>
            </div>
            <button
              className="button primary"
              onClick={() =>
                onBuy({
                  placeId: place.id,
                  accent,
                  style,
                  format,
                  font,
                  radius,
                })
              }
            >
              Add this to my website — $99
            </button>
            <small>12 months of syncing included</small>
          </div>
        </div>
      </div>
    </section>
  );
}
