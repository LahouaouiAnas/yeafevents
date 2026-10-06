import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { ImageAsset } from "@/lib/content/types";

type ArtDirectedImageProps = {
  /** Portrait photo for small screens. */
  mobile: ImageAsset;
  /** Landscape photo from 768px (Tailwind `md`) up. */
  desktop: ImageAsset;
  /** Describes both photos (they show the same setting). */
  alt: string;
  mobilePosition?: string;
  desktopPosition?: string;
  /** Only for the page's LCP image. */
  priority?: boolean;
  className?: string;
};

/** Two real photos, one per screen shape, through a single optimised <picture>. */
export function ArtDirectedImage({
  mobile,
  desktop,
  alt,
  mobilePosition = "center",
  desktopPosition = "center",
  priority = false,
  className = "",
}: ArtDirectedImageProps) {
  const common = { alt, sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height });
  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height });

  return (
    <picture className={className}>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
      <img
        {...rest}
        srcSet={mobileSrcSet}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos-d)]"
        style={{ "--pos-m": mobilePosition, "--pos-d": desktopPosition } as CSSProperties}
      />
    </picture>
  );
}
