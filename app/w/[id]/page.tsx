"use client";

import { useEffect, useState } from "react";
import ReviewWidget from "../../components/review-widget";
import type { GoogleReview } from "../../../lib/places";

type WidgetPayload = {
  name: string;
  rating?: number;
  count: number;
  mapsHref?: string;
  reviews: GoogleReview[];
  accent: string;
  style: string;
  format: number;
  error?: string;
};

export default function EmbedWidgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState("");
  const [data, setData] = useState<WidgetPayload | null>(null);
  const [error, setError] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const res = await fetch(`/api/widgets/${encodeURIComponent(id)}`);
        const json = (await res.json()) as WidgetPayload;
        if (!res.ok) throw new Error(json.error || "Widget not found.");
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Widget not found.");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <p>{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <p>Loading reviews…</p>
      </main>
    );
  }

  return (
    <main style={{ margin: 0, padding: 12, background: "transparent" }}>
      <ReviewWidget
        name={data.name}
        rating={data.rating}
        count={data.count}
        reviews={data.reviews || []}
        mapsHref={data.mapsHref}
        styleName={data.style}
        format={data.format}
        accent={data.accent}
        slide={slide}
        onSlide={setSlide}
      />
    </main>
  );
}
