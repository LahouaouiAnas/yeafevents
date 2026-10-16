"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { OPEN_BANNER, loadPixel, readConsent, revokePixel, subscribeConsent, track, writeConsent, type Consent } from "@/lib/tracking/meta";

type MetaPixelProps = {
  pixelId: string;
  privacyHref: string;
  labels: { title: string; text: string; accept: string; decline: string; more: string };
};

/** "unknown" while rendering on the server, so the banner never flashes before the stored choice is read. */
const getServerConsent = () => "unknown" as const;

/**
 * Cookie banner + Meta Pixel, rendered only when the pixel is switched on in the Studio. The
 * pixel loads after "Accept"; then page views, WhatsApp / phone / email clicks (Contact) and
 * package choices are sent. Quote requests (Lead) and event pages (ViewContent) call `track`.
 */
export function MetaPixel({ pixelId, privacyHref, labels }: MetaPixelProps) {
  const consent = useSyncExternalStore<Consent | null | "unknown">(subscribeConsent, readConsent, getServerConsent);
  const [reopened, setReopened] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_BANNER, open);
    return () => window.removeEventListener(OPEN_BANNER, open);
  }, []);

  useEffect(() => {
    if (consent === "granted") loadPixel(pixelId);
    if (consent === "denied") revokePixel();
  }, [consent, pixelId]);

  // One PageView per page, including client-side navigations.
  useEffect(() => {
    if (consent === "granted") track("PageView");
  }, [consent, pathname]);

  useEffect(() => {
    if (consent !== "granted") return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href") ?? "";
      if (/^(https:\/\/wa\.me|tel:|mailto:)/.test(href)) {
        track("Contact", { content_name: href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : "whatsapp" });
      } else if (href.includes("pack=")) {
        const params = new URL(href, window.location.origin).searchParams;
        track("ChoosePackage", { content_category: params.get("type") ?? undefined, content_name: params.get("pack") ?? undefined }, true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  if (consent === "unknown" || (consent !== null && !reopened)) return null;

  const choose = (value: Consent) => {
    writeConsent(value);
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={labels.title}
      className="fixed inset-x-4 bottom-4 z-50 max-w-md border border-champagne/40 bg-coal/95 p-6 shadow-2xl shadow-black/60 backdrop-blur sm:right-auto sm:left-6 sm:bottom-6"
    >
      <p className="eyebrow text-champagne">{labels.title}</p>
      <p className="mt-3 text-sm leading-relaxed text-ivory/85">
        {labels.text}{" "}
        <Link href={privacyHref} className="text-gold-soft underline decoration-champagne/40 underline-offset-4 hover:decoration-gold-soft">
          {labels.more}
        </Link>
      </p>
      {/* Both choices equally visible, as consent rules require. */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose("denied")} className="btn-line px-4 py-3">
          {labels.decline}
        </button>
        <button type="button" onClick={() => choose("granted")} className="btn-gold px-4 py-3">
          {labels.accept}
        </button>
      </div>
    </div>
  );
}
