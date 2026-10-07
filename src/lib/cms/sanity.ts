import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { isSanityConfigured, sanityConfig } from "./config";

export { isSanityConfigured, sanityConfig };

/**
 * Sanity connection. Without NEXT_PUBLIC_SANITY_PROJECT_ID the site keeps working with
 * empty CMS collections.
 *
 * The dataset holds quote requests (personal data), so it should be private: reads then
 * need a server-side token. SANITY_API_READ_TOKEN (Viewer) is used when set, otherwise the
 * write token the contact form already needs. Neither is ever sent to the browser.
 */
const readToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || undefined;

const client = isSanityConfigured
  ? createClient({ ...sanityConfig, token: readToken, useCdn: true, perspective: "published" })
  : null;

/**
 * Cache tags are the document types: the /api/revalidate webhook marks a type stale when
 * one of its documents is published, and the hourly revalidation is a safety net.
 */
export async function sanityFetch<T>(query: string, params: Record<string, string> = {}, tags: string[] = []): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(query, params, { next: { revalidate: 3600, tags } });
}

const imageBuilder = isSanityConfigured ? createImageUrlBuilder(sanityConfig) : null;

/** Image source as returned by the queries (asset dimensions resolved in GROQ). */
export type SanityImage = {
  asset?: { _ref?: string; _id?: string };
  crop?: unknown;
  hotspot?: unknown;
  alt?: string | null;
  width?: number;
  height?: number;
};

/** Delivery URL of the original image; next/image handles resizing and formats. */
export function sanityImageUrl(image: SanityImage): string | null {
  if (!imageBuilder || !image.asset) return null;
  return imageBuilder.image(image).url();
}
