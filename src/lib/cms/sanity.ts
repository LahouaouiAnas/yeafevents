/**
 * Sanity configuration placeholder. The client (`next-sanity`) will be added when the
 * CMS is wired; queries will then replace the bodies of `src/lib/content/index.ts`.
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
} as const;

export const isSanityConfigured = sanityConfig.projectId.length > 0;
