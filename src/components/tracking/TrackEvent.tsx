"use client";

import { useEffect } from "react";
import { track } from "@/lib/tracking/meta";

/** Sends one Meta Pixel event when the page is shown (only with consent; nothing otherwise). */
export function TrackEvent({ event, params }: { event: string; params?: Record<string, string> }) {
  const key = JSON.stringify(params ?? {});
  useEffect(() => {
    track(event, JSON.parse(key) as Record<string, string>);
  }, [event, key]);
  return null;
}
