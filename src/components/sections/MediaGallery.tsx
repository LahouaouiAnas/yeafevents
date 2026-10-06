import { AmbientVideo } from "@/components/media/AmbientVideo";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Media } from "@/components/ui/Media";
import type { ImageAsset, VideoAsset } from "@/lib/content/types";

type MediaGalleryProps = {
  images: ImageAsset[];
  video?: VideoAsset;
  videoLabel: string;
};

// The grid never grows wider than its content needs: one or two tiles stay medium-sized.
const layouts = {
  1: "max-w-sm grid-cols-1",
  2: "max-w-3xl grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
} as const;

/**
 * Even portrait tiles (no full-bleed). A video with a real poster plays muted while visible
 * on large screens; without one it waits for a click.
 */
export function MediaGallery({ images, video, videoLabel }: MediaGalleryProps) {
  const count = images.length + (video ? 1 : 0);
  if (count === 0) return null;
  const layout = layouts[Math.min(count, 3) as 1 | 2 | 3];
  // On phones (2 columns), an odd last tile spans the full row in a landscape crop.
  const lastIsWide = count > 1 && count % 2 === 1;
  const tileClass = (index: number) =>
    lastIsWide && index === count - 1 ? "col-span-2 lg:col-span-1 aspect-[16/10] lg:aspect-[3/4]" : "aspect-[3/4]";

  return (
    <ul className={`grid gap-4 sm:gap-6 ${layout}`}>
      {images.map((image, index) => (
        <li key={image.src} className={`reveal ${tileClass(index)}`}>
          <Media image={image} sizes="(min-width: 1024px) 30vw, 50vw" className="h-full" />
        </li>
      ))}
      {video && (
        <li className={`reveal ${tileClass(count - 1)}`}>
          {video.poster ? (
            <AmbientVideo video={video} trigger="inView" sizes="(min-width: 1024px) 30vw, 50vw" className="h-full" />
          ) : (
            <VideoPlayer video={video} label={videoLabel} />
          )}
        </li>
      )}
    </ul>
  );
}
