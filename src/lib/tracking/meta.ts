/**
 * Browser side of the Meta Pixel. Nothing reaches Meta unless the visitor accepted in the cookie
 * banner: the script is only added after that choice, and `track` does nothing before it.
 */

export type Consent = "granted" | "denied";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const KEY = "yeaf-consent-v1";
const CHANGE = "yeaf:consent";
/** Events sent with consent before the pixel was set up (page components run first); flushed by loadPixel. */
const pending: unknown[][] = [];

/** Asks the banner to open again (footer "Manage cookies" link). */
export const OPEN_BANNER = "yeaf:consent-open";

export function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Private browsing: the choice lasts for this page only.
  }
  window.dispatchEvent(new Event(CHANGE));
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Meta's standard loader: a queue that records calls until fbevents.js arrives. */
export function loadPixel(pixelId: string) {
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("consent", "grant");
  fbq("init", pixelId);
  for (const args of pending.splice(0)) fbq(...args);
}

/** Stops sending events after a visitor withdraws consent (the script cannot be unloaded). */
export function revokePixel() {
  window.fbq?.("consent", "revoke");
}

/** Sends a standard event (PageView, ViewContent, Lead, Contact) or a custom one. */
export function track(event: string, params?: Record<string, string | undefined>, custom = false) {
  if (readConsent() !== "granted") return;
  const data = params && Object.fromEntries(Object.entries(params).filter(([, value]) => value));
  const args = [custom ? "trackCustom" : "track", event, data];
  if (window.fbq) window.fbq(...args);
  else pending.push(args);
}
