"use client";

import { OPEN_BANNER } from "@/lib/tracking/meta";

/** Footer link that reopens the cookie banner, so a visitor can change their choice. */
export function ManageCookies({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_BANNER))} className={className}>
      {label}
    </button>
  );
}
