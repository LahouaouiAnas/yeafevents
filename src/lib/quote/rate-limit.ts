/**
 * In-memory limit per visitor IP. The site runs as a single Node.js process on Hostinger,
 * so this is enough to stop a script from flooding the inbox; it resets on restart.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map small: forget visitors with no recent request.
  if (hits.size > 5000) {
    for (const [ip, times] of hits) if (!times.some((time) => now - time < WINDOW_MS)) hits.delete(ip);
  }
  return false;
}
