import Image from "next/image";
import type { ImageAsset } from "@/lib/content/types";

type MediaProps = {
  image?: ImageAsset;
  /** Tailwind aspect ratio class, e.g. "aspect-[4/5]". Omit when the parent sizes the media. */
  aspect?: string;
  /** "cover" fills the nearest positioned ancestor (backgrounds); "frame" flows in the layout. */
  layout?: "frame" | "cover";
  sizes: string;
  /** CSS object-position, to keep the subject in frame when cropped. */
  position?: string;
  /** Only for the LCP image of a page. */
  preload?: boolean;
  /** Empty alt for purely decorative uses (e.g. a background already described nearby). */
  decorative?: boolean;
  className?: string;
  imageClassName?: string;
};

/** Fixed-ratio media frame (no CLS). Renders a neutral dark surface when no real image exists. */
export function Media({
  image,
  aspect = "",
  layout = "frame",
  sizes,
  position = "center",
  preload = false,
  decorative = false,
  className = "",
  imageClassName = "",
}: MediaProps) {
  const placement = layout === "cover" ? "absolute inset-0" : "relative";
  if (!image) return <div aria-hidden="true" className={`media-fallback ${placement} ${aspect} ${className}`} />;

  return (
    <div className={`${placement} overflow-hidden bg-graphite ${aspect} ${className}`}>
      <Image
        src={image.src}
        alt={decorative ? "" : image.alt}
        fill
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        className={`object-cover ${imageClassName}`}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
