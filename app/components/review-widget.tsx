"use client";
/* eslint-disable @next/next/no-img-element -- Google author photos are served unmodified. */
import { useMemo, useState, type CSSProperties } from "react";
import type { GoogleReview } from "../../lib/places";
import { safeGoogleUrl } from "../../lib/places";

type ReviewFilter = "recent" | "highest" | "photos" | "guides";

const FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: "recent", label: "Most recent" },
  { id: "highest", label: "Highest rated" },
  { id: "photos", label: "Photos" },
  { id: "guides", label: "Local guide" },
];

function reviewBody(r: GoogleReview) {
  // Prefer the author's original wording — never show Google's translation.
  return (r.originalText?.text || r.text?.text || "").trim();
}

function recencyScore(r: GoogleReview): number {
  if (r.publishTime) {
    const t = Date.parse(r.publishTime);
    if (!Number.isNaN(t)) return t;
  }
  const rel = (r.relativePublishTimeDescription || "").toLowerCase().trim();
  const now = Date.now();
  const numbered = rel.match(
    /(\d+)\s*(minute|hour|day|week|month|year)s?\s*ago/,
  );
  if (numbered) {
    const n = Number(numbered[1]);
    const unit = numbered[2] as
      | "minute"
      | "hour"
      | "day"
      | "week"
      | "month"
      | "year";
    const ms = {
      minute: 60_000,
      hour: 3_600_000,
      day: 86_400_000,
      week: 604_800_000,
      month: 2_592_000_000,
      year: 31_536_000_000,
    }[unit];
    return now - n * ms;
  }
  if (/^(a|an)\s+minute\s+ago$/.test(rel) || rel === "just now") return now;
  if (/^(a|an)\s+hour\s+ago$/.test(rel)) return now - 3_600_000;
  if (/^(a|an)\s+day\s+ago$/.test(rel) || rel === "yesterday")
    return now - 86_400_000;
  if (/^(a|an)\s+week\s+ago$/.test(rel)) return now - 604_800_000;
  if (/^(a|an)\s+month\s+ago$/.test(rel)) return now - 2_592_000_000;
  if (/^(a|an)\s+year\s+ago$/.test(rel)) return now - 31_536_000_000;
  if (r.visitDate?.year) {
    return Date.UTC(r.visitDate.year, (r.visitDate.month || 6) - 1, 15);
  }
  return 0;
}

function reviewHasPhotos(r: GoogleReview) {
  return (r.photoUrls?.filter(Boolean).length ?? 0) > 0;
}

function reviewIsLocalGuide(r: GoogleReview) {
  return r.isLocalGuide === true;
}

function applyReviewFilter(reviews: GoogleReview[], filter: ReviewFilter) {
  let list = [...reviews];
  if (filter === "photos") list = list.filter(reviewHasPhotos);
  else if (filter === "guides") list = list.filter(reviewIsLocalGuide);
  // Always best → worst among the visible set (recency as tie-breaker).
  return list.sort(
    (a, b) =>
      (b.rating ?? 0) - (a.rating ?? 0) || recencyScore(b) - recencyScore(a),
  );
}

function RatingStars({ rating = 5 }: { rating?: number }) {
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

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`google-mark ${className}`.trim()}
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function visitLabel(review: GoogleReview) {
  const v = review.visitDate;
  if (!v?.year) return null;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = v.month ? months[Math.max(0, v.month - 1)] : "";
  return month ? `Visited in ${month} ${v.year}` : `Visited in ${v.year}`;
}

function ReviewCard({
  review,
  index,
  active = false,
}: {
  review: GoogleReview;
  index: number;
  active?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const author = review.authorAttribution;
  const name = author?.displayName || "Google reviewer";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const photo = safeGoogleUrl(author?.photoUri);
  const visited = visitLabel(review);
  const body =
    reviewBody(review) ||
    "This customer left a rating without written feedback.";
  const localGuide = reviewIsLocalGuide(review);
  const mediaSrc = review.photoUrls?.find(Boolean);
  const mediaCount = review.photoUrls?.filter(Boolean).length ?? 0;

  return (
    <article className={`signature-card${active ? " is-active" : ""}`}>
      <div className="card-author">
        {photo ? (
          <img
            className="author-avatar"
            src={photo}
            alt=""
            loading="lazy"
            width={40}
            height={40}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className={`author-avatar tone-${index % 3}`}>{initials}</span>
        )}
        <div className="author-meta">
          <strong title={name}>{name}</strong>
          {localGuide ? (
            <span className="local-guide">
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M8 1.5 9.8 5.2 14 5.8l-3 2.9.7 4.1L8 10.9 4.3 12.8l.7-4.1-3-2.9 4.2-.6L8 1.5z"
                />
              </svg>
              Local Guide
            </span>
          ) : null}
        </div>
        <GoogleMark className="card-google" />

      </div>
      <div className="card-rating-row">
        <RatingStars rating={review.rating ?? 0} />
        <time>{review.relativePublishTimeDescription || ""}</time>
      </div>
      <p className={`review-body${expanded ? " is-expanded" : ""}`}>{body}</p>
      {body.length > 120 ? <button type="button" className="review-expand"
        aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show less" : "Read more"}
      </button> : null}
      {mediaSrc ? (
        <div className="review-media">
          <img src={mediaSrc} alt="" loading="lazy" />
          {mediaCount > 1 ? (
            <span className="media-count">{mediaCount} photos</span>
          ) : null}
        </div>
      ) : null}
      {visited ? (
        <span className="visit-badge">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 1.6c-2.4 0-4.4 1.9-4.4 4.3 0 3.2 4.4 8.5 4.4 8.5s4.4-5.3 4.4-8.5C12.4 3.5 10.4 1.6 8 1.6zm0 6.1A1.8 1.8 0 1 1 8 4.1a1.8 1.8 0 0 1 0 3.6z"
            />
          </svg>
          {visited}
        </span>
      ) : null}
    </article>
  );
}

const NavArrow = ({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`carousel-arrow ${dir}`}
    onClick={onClick}
    aria-label={dir === "prev" ? "Previous review" : "Next review"}
  >
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d={dir === "prev" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default function ReviewWidget({
  name,
  rating,
  count,
  reviews,
  styleName,
  format,
  accent,
  slide,
  onSlide,
  mapsHref,
}: {
  name: string;
  rating?: number;
  count: number;
  reviews: GoogleReview[];
  styleName: string;
  format: number;
  accent: string;
  slide: number;
  onSlide: (n: number) => void;
  mapsHref?: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>("recent");
  const filtered = useMemo(
    () => applyReviewFilter(reviews, filter),
    [reviews, filter],
  );
  const carouselReviews = filtered;
  const total = Math.max(1, carouselReviews.length);
  const carouselCount = Math.min(3, Math.max(1, carouselReviews.length));
  const safeSlide = carouselReviews.length
    ? slide % carouselReviews.length
    : 0;
  const displayed =
    format === 0
      ? carouselReviews
          .slice(safeSlide)
          .concat(carouselReviews.slice(0, safeSlide))
          .slice(0, carouselCount)
      : filtered;
  const mapsUrl =
    mapsHref ??
    ("https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(name));

  function setFilterAndReset(next: ReviewFilter) {
    setFilter(next);
    setShowAll(false);
    onSlide(0);
  }

  const filterControls = (extraClass = "") => (
    <div
      className={`rk-filters${extraClass ? ` ${extraClass}` : ""}`}
      role="group"
      aria-label="Filter reviews"
    >
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={filter === id}
          className={filter === id ? "on" : ""}
          onClick={() => setFilterAndReset(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );



  return (
    <div
      lang="en"
      className={`live-widget rk-live rk-premium style-${styleName}`}
      style={{ "--brand": accent } as CSSProperties}
    >
      {format === 0 && (
        <div className="rk-shell rk-shell-carousel">
          <header className="rk-widget-head rk-desktop-only">
            <div className="rk-brand-block">
              <div className="rk-brand-title">
                <GoogleMark />
                <h3>Google Reviews</h3>
              </div>
              <p>Real people. Real experiences. Real results.</p>
            </div>
            <div className="rk-head-stats">
              <RatingStars rating={rating ?? 0} />
              <b>{rating?.toFixed(1) ?? "—"}</b>
              <span>· {count.toLocaleString("en-US")} reviews</span>
            </div>
            <a
              className="rk-head-cta"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read all reviews
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M5 12h12M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </header>

          <div className="rk-mobile-hero rk-mobile-only">
            <span className="rk-mobile-pill">
              <GoogleMark /> Google Reviews
            </span>
            <h4>What customers say</h4>
            <div className="rk-summary-card">
              <div className="rk-summary-score">
                <strong>{rating?.toFixed(1) ?? "—"}</strong>
                <RatingStars rating={rating ?? 0} />
                <span>{count.toLocaleString("en-US")} reviews</span>
              </div>
              {filterControls("rk-summary-filters")}
            </div>
          </div>

          {filterControls("rk-desktop-only")}

          {displayed.length ? (
            <div
              className={`signature-reviews-wrap has-nav${carouselReviews.length > 1 ? " has-arrows" : ""}`}
            >
              <div
                className={`signature-reviews rk-carousel ${displayed.length === 1 ? "is-single" : ""}`}
              >
                {displayed.map((r, i) => (
                  <ReviewCard
                    key={`${r.authorAttribution?.displayName}-${filter}-${safeSlide}-${i}`}
                    review={r}
                    index={(safeSlide + i) % total}
                    active={i === 0}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-reviews">
              {reviews.length === 0
                ? "Google hasn’t returned written reviews for this business."
                : filter === "photos"
                  ? "No reviews with photos in this set."
                  : filter === "guides"
                    ? "No Local Guide reviews in this set."
                    : "No reviews match this filter."}
            </div>
          )}

          {carouselReviews.length > 1 ? (
            <div className="widget-nav" role="group" aria-label="Carousel navigation">
              <NavArrow
                dir="prev"
                onClick={() =>
                  onSlide(
                    (safeSlide - 1 + carouselReviews.length) %
                      carouselReviews.length,
                  )
                }
              />
              <div className="widget-dots" role="group" aria-label="Carousel pages">
                {carouselReviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={i === safeSlide}
                    aria-label={`Go to review ${i + 1}`}
                    className={i === safeSlide ? "on" : ""}
                    onClick={() => onSlide(i)}
                  />
                ))}
              </div>
              <NavArrow
                dir="next"
                onClick={() =>
                  onSlide((safeSlide + 1) % carouselReviews.length)
                }
              />
            </div>
          ) : null}

          <a
            className="rk-mobile-cta rk-mobile-only"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoogleMark />
            Read all on Google
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M5 12h12M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      )}
      {format === 1 && (
        <div className="rk-shell rk-shell-grid">
          <header className="rk-widget-head rk-grid-head rk-desktop-only">
            <div className="rk-brand-block">
              <div className="rk-brand-title">
                <GoogleMark />
                <h3>Google Reviews</h3>
              </div>
              <p className="rk-biz-name">{name}</p>
            </div>
            <div className="rk-summary-inline">
              <strong>{rating?.toFixed(1) ?? "—"}</strong>
              <div>
                <RatingStars rating={rating ?? 0} />
                <span>{count.toLocaleString("en-US")} reviews</span>
              </div>
            </div>
            <a
              className="rk-head-cta"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read all
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M5 12h12M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </header>

          <div className="rk-grid-mobile rk-mobile-only">
            <span className="rk-mobile-pill">
              <GoogleMark /> Google Reviews
            </span>
            <div className="rk-grid-mobile-score">
              <strong>{rating?.toFixed(1) ?? "—"}</strong>
              <RatingStars rating={rating ?? 0} />
              <span>{count.toLocaleString("en-US")} reviews</span>
            </div>
          </div>

          {filterControls()}
          {displayed.length ? (
            <div className={`signature-reviews as-grid${showAll ? " show-all" : ""}`}>
              {displayed.map((r, i) => (
                <ReviewCard
                  key={`${r.authorAttribution?.displayName}-${i}`}
                  review={r}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              {reviews.length ? "No reviews match this filter." : "Google hasn’t returned written reviews for this business."}
            </div>
          )}

          {filtered.length > 2 && <button type="button" className="rk-grid-more"
            aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer reviews" : `Show all ${filtered.length} reviews`}
          </button>}

          <a
            className="rk-mobile-cta rk-mobile-only"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoogleMark />
            Read all on Google
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M5 12h12M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      )}
      {format === 2 && (
        <div className="rk-float-stage">
          <div className="rk-site-mock" aria-hidden="true">
            <span className="rk-site-bar">
              <i />
              <i />
              <i />
              <em>yoursite.com</em>
            </span>
            <div className="rk-site-body">
              <b>Welcome back.</b>
              <span />
              <span />
              <span className="short" />
            </div>
          </div>
          <a
            className="rk-float-badge"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="badge-google">
              <GoogleMark />
            </span>
            <span className="rk-float-copy">
              <strong title={name}>{name}</strong>
              <span className="rk-float-rating">
                <b>{rating?.toFixed(1) ?? "—"}</b>
                <RatingStars rating={rating ?? 0} />
              </span>
              <small>{count.toLocaleString("en-US")} Google reviews</small>
            </span>
            <span className="rk-float-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      )}
      {format === 3 && (
        <div className="rk-trust-stage">
          <a
            className="rk-trust-badge"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="badge-google">
              <GoogleMark />
            </span>
            <span className="rk-trust-score">
              <b>{rating ? `${rating.toFixed(1)} on Google` : "Not yet rated"}</b>
              <RatingStars rating={rating ?? 0} />
            </span>
            <span className="rk-trust-count">
              <strong>{count.toLocaleString("en-US")}</strong>
              <small>reviews</small>
            </span>
          </a>
          <p>Social proof, right next to your call to action.</p>
        </div>
      )}
      {format === 4 && (
        <div className="rk-invite">
          <div className="rk-invite-top">
            <GoogleMark />
            <span>Google Reviews</span>
          </div>
          <div className="rk-invite-stars" aria-hidden="true">
            <RatingStars rating={5} />
          </div>
          <h4>
            Loved your visit?
            <br />
            Leave a quick review.
          </h4>
          <p>Share your experience with {name} on Google.</p>
          <a
            className="rk-invite-cta"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Leave a Google review
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M5 12h12M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
