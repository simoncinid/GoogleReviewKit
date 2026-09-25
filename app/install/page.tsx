"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function snippetFor(origin: string, widgetId: string) {
  return `<!-- GoogleReviewsKit -->
<iframe
  src="${origin}/w/${widgetId}"
  title="Google reviews"
  loading="lazy"
  style="width:100%;min-height:520px;border:0;border-radius:16px;overflow:hidden;"
></iframe>`;
}

export default function InstallPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "setup" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [widgetId, setWidgetId] = useState("");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );
    if (!sessionId) {
      setStatus("error");
      setError("Missing payment session. Open this page from Stripe checkout.");
      return;
    }
    void (async () => {
      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json()) as {
          widgetId?: string;
          flow?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Could not verify payment.");
        if (data.widgetId) {
          setWidgetId(data.widgetId);
          setStatus("ready");
          return;
        }
        if (data.flow === "setup") {
          window.location.replace(
            `/setup?session_id=${encodeURIComponent(sessionId)}`,
          );
          return;
        }
        setStatus("error");
        setError("Payment verified, but the widget is not ready yet.");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Could not verify payment.");
      }
    })();
  }, []);

  const code = useMemo(
    () => (widgetId && origin ? snippetFor(origin, widgetId) : ""),
    [widgetId, origin],
  );

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
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

      {status === "loading" && (
        <>
          <h1>Confirming your payment…</h1>
          <p>One moment while we prepare your embed code.</p>
        </>
      )}

      {status === "error" && (
        <>
          <h1>We couldn’t finish setup</h1>
          <p>{error}</p>
          <p>
            <Link href="/#pricing">Back to pricing</Link>
          </p>
        </>
      )}

      {status === "ready" && (
        <>
          <h1>Your widget is ready</h1>
          <p>
            Payment confirmed. Paste this snippet into your website’s embed /
            custom HTML block.
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#f8f9fa",
              border: "1px solid #e8eaed",
              borderRadius: 12,
              padding: 16,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {code}
          </pre>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button type="button" className="button primary" onClick={copy}>
              {copied ? "Copied" : "Copy embed code"}
            </button>
            <a className="button" href={`/w/${widgetId}`} target="_blank" rel="noreferrer">
              Preview widget
            </a>
            <Link className="text-link" href="/">
              Back home
            </Link>
          </div>
          <p style={{ marginTop: 24, color: "#5f6368", fontSize: 14 }}>
            Widget ID: <code>{widgetId}</code>
          </p>
        </>
      )}
    </main>
  );
}
