const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Builds a Cloudinary delivery URL. Resizing and format negotiation stay with
 * next/image (res.cloudinary.com is allowed in next.config.ts); for videos, pass
 * transformations such as "q_auto,w_1280" explicitly.
 */
export function cloudinaryUrl(
  publicId: string,
  { resourceType = "image", transformations }: { resourceType?: "image" | "video"; transformations?: string } = {},
): string {
  if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  const parts = [`https://res.cloudinary.com/${cloudName}/${resourceType}/upload`];
  if (transformations) parts.push(transformations);
  parts.push(publicId);
  return parts.join("/");
}
