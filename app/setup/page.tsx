"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Place } from "../../lib/places";

export default function SetupPage() {
  const [sessionId, setSessionId] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [status, setStatus] = useState<
    "boot" | "ready" | "searching" | "saving" | "error"
  >("boot");
  const [error, setError] = useState("");
  const [paidPlan, setPaidPlan] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id");
    if (!id) {
      setStatus("error");
      setError("Missing payment session.");
      return;
    }
    setSessionId(id);
    void (async () => {
      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(id)}`,
        );
        const data = (await res.json()) as {
          widgetId?: string;
          plan?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Could not verify payment.");
        if (data.widgetId) {
          window.location.replace(
            `/install?session_id=${encodeURIComponent(id)}`,
          );
          return;
        }
        setPaidPlan(data.plan || "");
        setStatus("ready");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Could not verify payment.");
      }
    })();
  }, []);

  async function search() {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setError("Enter a name and city — at least 3 characters.");
      return;
    }
    setStatus("searching");
    setError("");
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = (await res.json()) as { places?: Place[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Search unavailable.");
      setResults(data.places || []);
      setStatus("ready");
      if (!(data.places || []).length) setError("No businesses found.");
    } catch (e) {
      setStatus("ready");
      setError(e instanceof Error ? e.message : "Search unavailable.");
    }
  }

  async function choose(place: Place) {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/widgets/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          draft: {
            placeId: place.id,
            placeName: place.displayName?.text,
            accent: "#1a73e8",
            style: "signature",
            format: 0,
            font: "modern",
            radius: "soft",
          },
        }),
      });
      const data = (await res.json()) as { widgetId?: string; error?: string };
      if (!res.ok || !data.widgetId)
        throw new Error(data.error || "Could not create widget.");
      window.location.assign(
        `/install?session_id=${encodeURIComponent(sessionId)}`,
      );
    } catch (e) {
      setStatus("ready");
      setError(e instanceof Error ? e.message : "Could not create widget.");
    }
  }

  return (
    <main className="wrap legal-page" style={{ paddingBlock: 48 }}>
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

      {status === "boot" && (
        <>
          <h1>Confirming your payment…</h1>
          <p>Then you’ll pick your business.</p>
        </>
      )}

      {status === "error" && (
        <>
          <h1>Setup unavailable</h1>
          <p>{error}</p>
          <Link href="/#pricing">Back to pricing</Link>
        </>
      )}

      {(status === "ready" || status === "searching" || status === "saving") && (
        <>
          <h1>Payment confirmed. Find your business.</h1>
          <p>
            {paidPlan === "founding"
              ? "Your $99 + $4.99/mo plan is active."
              : paidPlan === "monthly"
                ? "Your free + $14.99/mo plan is active."
                : "Your plan is active."}{" "}
            Select the Google listing to embed.
          </p>
          <div className="search-field" style={{ maxWidth: 480, marginTop: 20 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void search();
              }}
              placeholder="Business name and city"
              disabled={status === "saving"}
            />
            <button
              type="button"
              className="button primary"
              onClick={() => void search()}
              disabled={status === "searching" || status === "saving"}
            >
              {status === "searching" ? "Searching…" : "Find"}
            </button>
          </div>
          {error && <p style={{ color: "#c5221f", marginTop: 12 }}>{error}</p>}
          <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
            {results.map((place) => (
              <li key={place.id} style={{ marginBottom: 10 }}>
                <button
                  type="button"
                  className="button"
                  style={{ width: "100%", justifyContent: "flex-start" }}
                  disabled={status === "saving"}
                  onClick={() => void choose(place)}
                >
                  <span>
                    <b>{place.displayName?.text || "Business"}</b>
                    <br />
                    <small>{place.formattedAddress}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
