import Image from "next/image";
import { logo } from "@/content/media";

/**
 * Site logo. `size` is the rendered width; the height follows the
 * file's ratio so no space jumps on load. The surrounding link carries the accessible name.
 */
export function Logo({ size = 75 }: { size?: number }) {
  const height = Math.round((size * logo.height) / logo.width);
  return (
    <span className="flex items-center leading-none">
      <Image src={logo.src} alt="" width={size} height={height} sizes={`${size}px`} className="shrink-0" />
    </span>
  );
}
