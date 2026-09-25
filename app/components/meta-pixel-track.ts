/** Fire only after a successful waitlist submit with email. */
export function trackWaitlistLead() {
  if (typeof window === "undefined") return;
  const fbq = (
    window as Window & { fbq?: (...args: unknown[]) => void }
  ).fbq;
  if (typeof fbq !== "function") return;
  fbq("track", "Lead");
}
