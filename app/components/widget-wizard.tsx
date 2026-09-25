"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { GoogleReview, Place } from "../../lib/places";
import ReviewWidget from "./review-widget";

export type WizardStep = 1 | 2 | 3 | 4;

const STYLES = [
  ["signature", "Signature", "Clean and confident"],
  ["editorial", "Editorial", "A little more character"],
  ["contrast", "Contrast", "Bold, nothing to hide"],
] as const;

const COLORS = ["#1a73e8", "#0b57d0", "#9d4230", "#202124"];

const FORMATS = [
  "Carousel",
  "Review grid",
  "Floating badge",
  "Trust badge",
  "Review button",
];

function shortAddress(addr?: string) {
  if (!addr) return "";
  const cleaned = addr.replace(/,?\s*(Italy|United States.*)$/i, "");
  const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
  const street = parts.slice(0, 2).join(", ");
  const last = parts.at(-1) || "";
  const city = last
    .replace(/^\d{4,}\s*/, "")
    .replace(/\s+[A-Z]{2}$/, "")
    .trim();
  if (city && !street.includes(city)) return `${street} · ${city}`;
  return street || addr;
}

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

export default function WidgetWizard({
  step,
  setStep,
  query,
  setQuery,
  results,
  status,
  error,
  busy,
  searching,
  pickedId,
  setPickedId,
  search,
  selectPlace,
  name,
  rating,
  count,
  reviews,
  mapsHref,
  format,
  setFormat,
  accent,
  setAccent,
  style,
  setStyle,
  slide,
  setSlide,
  plan,
  setPlan,
  buy,
  ctaLabel = "Add to my website",
}: {
  step: WizardStep;
  setStep: (n: WizardStep) => void;
  query: string;
  setQuery: (v: string) => void;
  results: Place[];
  status: "idle" | "searching" | "choosing" | "loading" | "empty" | "error";
  error: string;
  busy: boolean;
  searching: boolean;
  pickedId: string;
  setPickedId: (id: string) => void;
  search: (q?: string) => void;
  selectPlace: (id: string) => void;
  name: string;
  rating?: number;
  count: number;
  reviews: GoogleReview[];
  mapsHref?: string;
  format: number;
  setFormat: (n: number) => void;
  accent: string;
  setAccent: (c: string) => void;
  style: string;
  setStyle: (s: string) => void;
  slide: number;
  setSlide: (n: number) => void;
  plan: "founding" | "monthly";
  setPlan: (p: "founding" | "monthly") => void;
  buy: (plan: "founding" | "monthly") => void;
  ctaLabel?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const desktop = useDesktop();

  // Both: 1 business · 2 design/style · 3 preview (internal steps 1, 2, 4)
  const uiStep = step === 4 ? 3 : step === 3 ? 2 : step;
  const totalSteps = 3;
  const phase =
    step === 1
      ? "business"
      : desktop && (step === 2 || step === 3)
        ? "design"
        : step === 2 || step === 3
          ? "style"
          : "preview";

  useEffect(() => {
    const el = document.getElementById("playground");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("wizard-in-view", entry.isIntersecting);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      document.body.classList.remove("wizard-in-view");
    };
  }, []);

  // Step 3 is folded into step 2 (design on desktop, style+format on mobile)
  useEffect(() => {
    if (step === 3) setStep(2);
  }, [step, setStep]);

  function goBack() {
    if (step === 4) setStep(2);
    else if (step === 2) setStep(1);
  }

  function goNextFromDesign() {
    setStep(4);
  }

  const stepLabels = desktop
    ? (["Business", "Design", "Preview"] as const)
    : (["Business", "Style", "Preview"] as const);

  return (
    <div
      className={`rk-wizard ${desktop ? "is-desktop" : "is-mobile"} phase-${phase}`}
      style={{ "--brand": accent } as CSSProperties}
    >
      <header className="rk-bar">
        <div className="rk-brand">
          <span className="rk-logo">
            googlereviewskit<span>.</span>
          </span>
          <ol className="rk-steps" aria-label="Setup steps">
            {stepLabels.map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3 | 4;
              const done = uiStep > n;
              const on = uiStep === n;
              return (
                <li key={label} className={on ? "on" : done ? "done" : ""}>
                  <button
                    type="button"
                    disabled={n > uiStep}
                    aria-current={on ? "step" : undefined}
                    onClick={() => {
                      if (n >= uiStep) return;
                      setStep(n === 1 ? 1 : n === 2 ? 2 : 4);
                    }}
                  >
                    <span>{done ? "✓" : n}</span>
                    {label}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {phase === "business" && (
        <div className="rk-stage">
          <div className="rk-body">
            <span className="rk-eyebrow">STEP 01 · YOUR BUSINESS</span>
            <h2>
              Find your <span className="heading-accent">business.</span>
            </h2>
            <form
              className="rk-search"
              onSubmit={(e) => {
                e.preventDefault();
                void search(query);
              }}
            >
              <input
                id="rk-search"
                ref={input}
                type="search"
                autoComplete="off"
                placeholder="Business name and city"
                value={query}
                maxLength={160}
                disabled={busy}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  className="rk-clear"
                  aria-label="Clear"
                  onClick={() => {
                    setQuery("");
                    input.current?.focus();
                  }}
                >
                  ×
                </button>
              ) : null}
              <button type="submit" className="rk-search-go" disabled={busy || searching}>
                {searching ? "…" : "Find"}
              </button>
            </form>
            {status === "error" && <p className="rk-note err">{error}</p>}
            {status === "empty" && (
              <p className="rk-note">No matches. Try a more specific name.</p>
            )}
            {searching && results.length === 0 && (
              <p className="rk-note">Searching…</p>
            )}
            {results.length > 0 && (
              <ul className="rk-list">
                {results.map((result) => {
                  const on = pickedId === result.id;
                  return (
                    <li key={result.id}>
                      <button
                        type="button"
                        className={on ? "on" : ""}
                        disabled={busy}
                        onClick={() => {
                          setPickedId(result.id);
                          void selectPlace(result.id);
                        }}
                      >
                        <span className="rk-mono">
                          {result.displayName?.text?.[0] || "B"}
                        </span>
                        <span className="rk-info">
                          <b>{result.displayName?.text}</b>
                          <small>{shortAddress(result.formattedAddress)}</small>
                        </span>
                        <span className={`rk-radio ${on ? "on" : ""}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <footer className="rk-foot">
              <button
                type="button"
                className="button primary rk-cta"
                disabled={busy || !pickedId}
                onClick={() => pickedId && void selectPlace(pickedId)}
              >
                {busy ? "Loading…" : "Use this business"}
              </button>
            </footer>
          </div>
        </div>
      )}

      {phase === "style" && (
        <div className="rk-stage">
          <div className="rk-body">
            <span className="rk-eyebrow">STEP 02 · MAKE IT YOURS</span>
            <h2>
              Design your <span className="heading-accent">widget.</span>
            </h2>
            <span className="rk-label">Style</span>
            <div className="rk-style-grid">
              {STYLES.map(([id, label, desc]) => (
                <button
                  key={id}
                  type="button"
                  className={`rk-style-card ${id} ${style === id ? "on" : ""}`}
                  aria-pressed={style === id}
                  onClick={() => setStyle(id)}
                >
                  <span className="rk-style-thumb" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <b>{label}</b>
                  <small>{desc}</small>
                </button>
              ))}
            </div>
            <span className="rk-label">Brand color</span>
            <div className="rk-colors">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  style={{ background: c }}
                  aria-label={c}
                  aria-pressed={accent === c}
                  onClick={() => setAccent(c)}
                >
                  {accent === c ? "✓" : ""}
                </button>
              ))}
              <label className="rk-plus">
                +
                <input
                  type="color"
                  value={accent}
                  aria-label="Custom color"
                  onChange={(e) => setAccent(e.target.value)}
                />
              </label>
            </div>
            <span className="rk-label">Format</span>
            <div className="rk-format-list">
              {FORMATS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={`rk-format ${format === i ? "on" : ""}`}
                  aria-pressed={format === i}
                  onClick={() => setFormat(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <footer className="rk-foot">
              <button
                type="button"
                className="button primary rk-cta"
                onClick={() => setStep(4)}
              >
                See my widget
              </button>
              <button type="button" className="rk-link" onClick={goBack}>
                Back
              </button>
            </footer>
          </div>
        </div>
      )}

      {phase === "design" && (
        <div className="rk-stage rk-design">
          <div className="rk-body">
            <div className="rk-design-copy">
              <span className="rk-eyebrow">STEP 02 · MAKE IT YOURS</span>
              <h2>
                Design your <span className="heading-accent">widget.</span>
              </h2>
              <span className="rk-label">Style</span>
              <div className="rk-style-grid">
                {STYLES.map(([id, label, desc]) => (
                  <button
                    key={id}
                    type="button"
                    className={`rk-style-card ${id} ${style === id ? "on" : ""}`}
                    aria-pressed={style === id}
                    onClick={() => setStyle(id)}
                  >
                    <span className="rk-style-thumb" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <b>{label}</b>
                    <small>{desc}</small>
                  </button>
                ))}
              </div>
              <span className="rk-label">Brand color</span>
              <div className="rk-colors">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={{ background: c }}
                    aria-label={c}
                    aria-pressed={accent === c}
                    onClick={() => setAccent(c)}
                  >
                    {accent === c ? "✓" : ""}
                  </button>
                ))}
                <label className="rk-plus">
                  +
                  <input
                    type="color"
                    value={accent}
                    aria-label="Custom color"
                    onChange={(e) => setAccent(e.target.value)}
                  />
                </label>
              </div>
              <span className="rk-label">Format</span>
              <div className="rk-format-row">
                {FORMATS.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className={`rk-format ${format === i ? "on" : ""}`}
                    aria-pressed={format === i}
                    onClick={() => setFormat(i)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rk-design-preview-col">
              <div className="rk-design-stage">
                <span className="rk-stage-label">Live preview</span>
                <ReviewWidget
                  name={name}
                  rating={rating}
                  count={count}
                  reviews={reviews}
                  mapsHref={mapsHref}
                  styleName={style}
                  format={format}
                  accent={accent}
                  slide={slide}
                  onSlide={setSlide}
                />
              </div>
              <footer className="rk-foot rk-foot-under-widget">
                <button
                  type="button"
                  className="button primary rk-cta"
                  onClick={goNextFromDesign}
                >
                  See my widget
                </button>
                <button type="button" className="rk-link" onClick={goBack}>
                  Back
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}

      {phase === "preview" && (
        <div className="rk-stage rk-result">
          <div className="rk-body">
            <div className="rk-result-copy">
              <span className="rk-eyebrow">STEP 03 · READY</span>
              <h2>
                That’s your <span className="heading-accent">widget.</span>
              </h2>
              <div className="rk-plans rk-plans-desktop">
                <button
                  type="button"
                  className={plan === "monthly" ? "on" : ""}
                  onClick={() => setPlan("monthly")}
                >
                  <b>Free</b>
                  <small>+ $14.99/mo</small>
                </button>
                <button
                  type="button"
                  className={plan === "founding" ? "on" : ""}
                  onClick={() => setPlan("founding")}
                >
                  <b>$99</b>
                  <small>+ $4.99/mo</small>
                </button>
              </div>
              <footer className="rk-foot rk-foot-inline">
                <button
                  type="button"
                  className="button primary rk-cta"
                  onClick={() => buy(plan)}
                >
                  {ctaLabel}
                </button>
                <button type="button" className="rk-link" onClick={goBack}>
                  Back
                </button>
              </footer>
            </div>
            <div className="rk-result-stage">
              <span className="rk-stage-label">Your widget</span>
              <ReviewWidget
                name={name}
                rating={rating}
                count={count}
                reviews={reviews}
                mapsHref={mapsHref}
                styleName={style}
                format={format}
                accent={accent}
                slide={slide}
                onSlide={setSlide}
              />
            </div>
            <div className="rk-plans rk-plans-mobile">
              <button
                type="button"
                className={plan === "monthly" ? "on" : ""}
                onClick={() => setPlan("monthly")}
              >
                <b>Free</b>
                <small>+ $14.99/mo</small>
              </button>
              <button
                type="button"
                className={plan === "founding" ? "on" : ""}
                onClick={() => setPlan("founding")}
              >
                <b>$99</b>
                <small>+ $4.99/mo</small>
              </button>
            </div>
            <footer className="rk-foot rk-foot-mobile-only">
              <button
                type="button"
                className="button primary rk-cta"
                onClick={() => buy(plan)}
              >
                {ctaLabel}
              </button>
              <button type="button" className="rk-link" onClick={goBack}>
                Back
              </button>
            </footer>
          </div>
        </div>
      )}

      <span className="sr-only">{totalSteps} steps</span>
    </div>
  );
}
