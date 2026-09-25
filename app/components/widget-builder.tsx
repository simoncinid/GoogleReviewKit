"use client";
import { useEffect, useRef, useState } from "react";
import type { Place } from "../../lib/places";
import { samplePlace } from "../../lib/widget-sample";
import WidgetWizard, { type WizardStep } from "./widget-wizard";


type BuyConfig = {
  placeId: string;
  placeName?: string;
  accent: string;
  style: string;
  format: number;
  font: string;
  radius: string;
  plan: "founding" | "monthly";
};

export default function WidgetBuilder({
  onBuy,
  ctaLabel = "Add to my website",
}: {
  onBuy: (config?: BuyConfig) => void;
  ctaLabel?: string;
}) {
  const [step, setStep] = useState<WizardStep>(1);
  const [place, setPlace] = useState<Place>(samplePlace);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [status, setStatus] = useState<
    "idle" | "searching" | "choosing" | "loading" | "empty" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [format, setFormat] = useState(0);
  const [accent, setAccent] = useState("#1a73e8");
  const [style, setStyle] = useState("signature");
  const [slide, setSlide] = useState(0);
  const [pickedId, setPickedId] = useState("");
  const [plan, setPlan] = useState<"founding" | "monthly">("monthly");
  const requestId = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const reviews = place.reviews || [];
  const name = place.displayName?.text || "Your business";
  const busy = status === "loading";
  const searching = status === "searching";

  async function search(rawQuery = query, opts?: { fromTyping?: boolean }) {
    const trimmed = rawQuery.trim();
    if (trimmed.length < 3) {
      if (!opts?.fromTyping) {
        setError("Enter a name and city — at least 3 characters.");
        setStatus("error");
      } else {
        setResults([]);
        setError("");
        setStatus("idle");
      }
      return;
    }
    const id = ++requestId.current;
    abort.current?.abort();
    abort.current = new AbortController();
    setStatus("searching");
    setError("");
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
        signal: abort.current.signal,
      });
      const data = (await response.json()) as {
        places?: Place[];
        error?: string;
      };
      if (id !== requestId.current) return;
      if (!response.ok)
        throw new Error(data.error || "Search is unavailable.");
      const places = data.places || [];
      setResults(places);
      setPickedId((prev) => {
        if (prev && places.some((p) => p.id === prev)) return prev;
        return places[0]?.id || "";
      });
      setStatus(places.length ? "choosing" : "empty");
    } catch (e) {
      if (id !== requestId.current) return;
      if (e instanceof DOMException && e.name === "AbortError") return;
      setStatus("error");
      setError(e instanceof Error ? e.message : "Search is unavailable.");
    }
  }

  useEffect(() => {
    if (step !== 1) return;
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      abort.current?.abort();
      setResults([]);
      setPickedId("");
      setError("");
      setStatus((s) =>
        s === "searching" || s === "choosing" || s === "empty" || s === "error"
          ? "idle"
          : s,
      );
      return;
    }
    const timer = window.setTimeout(() => {
      void search(query, { fromTyping: true });
    }, 320);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- live search only reacts to query/step
  }, [query, step]);

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
      setStep(2);
    } catch (e) {
      if (current !== requestId.current) return;
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load this business.");
    }
  }

  function buy(nextPlan: "founding" | "monthly") {
    onBuy({
      placeId: place.id,
      placeName: place.displayName?.text,
      accent,
      style,
      format,
      font: "modern",
      radius: "soft",
      plan: nextPlan,
    });
  }

  return (
    <section className="playground" id="playground">
      <WidgetWizard
        step={step}
        setStep={setStep}
        query={query}
        setQuery={(v) => {
          setQuery(v);
          setError("");
        }}
        results={results}
        status={status}
        error={error}
        busy={busy}
        searching={searching}
        pickedId={pickedId}
        setPickedId={setPickedId}
        search={(q) => void search(q ?? query)}
        selectPlace={(id) => void selectPlace(id)}
        name={name}
        rating={place.rating}
        count={place.userRatingCount ?? 0}
        reviews={reviews}
        mapsHref={place.googleMapsUri}
        format={format}
        setFormat={setFormat}
        accent={accent}
        setAccent={setAccent}
        style={style}
        setStyle={setStyle}
        slide={slide}
        setSlide={setSlide}
        plan={plan}
        setPlan={setPlan}
        buy={buy}
        ctaLabel={ctaLabel}
      />
    </section>
  );
}
