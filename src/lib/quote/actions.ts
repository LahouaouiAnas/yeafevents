"use server";

import { headers } from "next/headers";
import { getCategories } from "@/lib/content";
import { deliverQuoteRequest, hasDeliveryChannel } from "./deliver";
import { isRateLimited } from "./rate-limit";
import type { QuoteState } from "./types";
import { parseQuoteRequest } from "./validate";

/** Faster than this between page load and submit, it is a script, not a person. */
const MIN_FILL_MS = 3000;

export async function submitQuoteRequest(_previous: QuoteState, form: FormData): Promise<QuoteState> {
  // Spam traps: a hidden field people never fill, and an impossibly fast submission.
  // Bots get a fake success so they have nothing to adjust.
  const startedAt = Number(form.get("startedAt"));
  if (form.get("website") || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: "success" };
  }

  const categories = await getCategories("fr");
  const eventTypes = [...categories.map((category) => category.key), "other"];
  const parsed = parseQuoteRequest(form, eventTypes);
  if (parsed.invalid) return { status: "error", reason: "invalid", fields: parsed.invalid };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) return { status: "error", reason: "rateLimited" };

  if (!hasDeliveryChannel) {
    console.error("[quote] no delivery channel configured (SMTP or SANITY_API_WRITE_TOKEN)");
    return { status: "error", reason: "unavailable" };
  }

  // The agency reads requests in French, whatever the visitor's language.
  const { request } = parsed;
  const eventLabel = categories.find((category) => category.key === request.eventType)?.singular ?? "Autre";

  const delivered = await deliverQuoteRequest(request, eventLabel);
  return delivered ? { status: "success" } : { status: "error", reason: "unavailable" };
}
