import { Media } from "@/components/ui/Media";
import type { VideoAsset } from "@/lib/content/types";
import { VideoLayer } from "./VideoLayer";

type AmbientVideoProps = {
  video: VideoAsset;
  trigger: "afterLoad" | "inView";
  sizes: string;
  posterPosition?: string;
  videoPosition?: string;
  className?: string;
};

/**
 * Real poster photo (server-rendered, optimised) + muted video layered on top on large screens.
 * Small screens and reduced-motion users only get the photo.
 */
export function AmbientVideo({ video, trigger, sizes, posterPosition, videoPosition, className = "" }: AmbientVideoProps) {
  return (
    <div className={`relative overflow-hidden bg-graphite ${className}`}>
      {video.poster && <Media image={video.poster} sizes={sizes} position={posterPosition} layout="cover" />}
      <VideoLayer src={video.src} type={video.type} trigger={trigger} objectPosition={videoPosition} />
    </div>
  );
}
