import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

/**
 * Sanity connection. Content is read through the public CDN API (the dataset is public;
 * no token needed). Without NEXT_PUBLIC_SANITY_PROJECT_ID the site keeps working with
 * empty CMS collections.
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
} as const;

export const isSanityConfigured = sanityConfig.projectId.length > 0;

const client = isSanityConfigured ? createClient({ ...sanityConfig, useCdn: true, perspective: "published" }) : null;

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
