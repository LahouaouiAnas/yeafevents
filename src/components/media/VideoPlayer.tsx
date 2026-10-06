import { getImageProps } from "next/image";
import type { VideoAsset } from "@/lib/content/types";

type VideoPlayerProps = {
  video: VideoAsset;
  label: string;
  className?: string;
};

/**
 * Click-to-play video: nothing heavy is downloaded until the visitor asks for it.
 * Without a real poster photo, the browser shows the video's own first frame (#t=0.1);
 * no image is ever extracted from the video file.
 */
export function VideoPlayer({ video, label, className = "" }: VideoPlayerProps) {
  const poster = video.poster
    ? getImageProps({ src: video.poster.src, width: video.poster.width, height: video.poster.height, alt: "", sizes: "50vw", quality: 75 }).props.src
    : undefined;

  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
      className={`h-full w-full bg-graphite object-cover ${className}`}
    >
      <source src={`${video.src}#t=0.1`} type={video.type} />
    </video>
  );
}
