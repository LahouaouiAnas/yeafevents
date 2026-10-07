/** Public Sanity settings, safe for the browser (the Studio imports them). No tokens here. */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
} as const;

export const isSanityConfigured = sanityConfig.projectId.length > 0;
