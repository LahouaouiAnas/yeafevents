/** Runs once when a server process starts (not during `next build`). */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { seedEventCategories } = await import("@/lib/cms/seed");
  // In the background: the site starts serving immediately, the import finishes on its own.
  void seedEventCategories().catch((error) => console.error("[seed] event types not imported", error));
}
