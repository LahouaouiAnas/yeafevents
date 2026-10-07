import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Called by a Sanity webhook when a document is published, updated or deleted. Marks the
 * document's type stale so the pages that list it are rebuilt on their next visit.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);
  if (!isValidSignature) return Response.json({ message: "Invalid signature" }, { status: 401 });
  if (!body?._type) return Response.json({ message: "Missing _type" }, { status: 400 });

  // expire: 0 so the very next visit already shows the change (low-traffic site).
  revalidateTag(body._type, { expire: 0 });
  return Response.json({ revalidated: body._type });
}
