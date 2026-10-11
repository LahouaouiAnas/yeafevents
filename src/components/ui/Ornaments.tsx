import { useId, type ReactNode } from "react";

/**
 * Decorative layer inspired by Moroccan craft: zellige star lattice, khatam star, arches.
 * Everything is aria-hidden, drawn in thin champagne lines at low opacity, and placed
 * behind content (the parent must be `relative isolate`).
 */

/** Eight-pointed star (khatam): two squares, one turned 45°. Centered in a 100×100 box. */
const STAR = "M50 8 L79.7 20.3 L92 50 L79.7 79.7 L50 92 L20.3 79.7 L8 50 L20.3 20.3 Z";
const SQUARE_A = "M20.3 20.3 H79.7 V79.7 H20.3 Z";
const SQUARE_B = "M50 8 L92 50 L50 92 L8 50 Z";

/** Tiled zellige-like lattice of eight-pointed stars, fading out from one side. */
export function ZelligePattern({
  className = "",
  fade = "right",
}: {
  className?: string;
  /** Where the pattern is strongest; it fades away from there. */
  fade?: "left" | "right" | "center";
}) {
  const id = useId().replace(/:/g, "");
  const masks = {
    left: "linear-gradient(to right, black, transparent 70%)",
    right: "linear-gradient(to left, black, transparent 70%)",
    center: "radial-gradient(closest-side, black, transparent)",
  } as const;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full text-champagne ${className}`}
      style={{ maskImage: masks[fade], WebkitMaskImage: masks[fade] }}
    >
      <defs>
        <pattern id={`zellige-${id}`} width="96" height="96" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.7" transform="scale(0.96)">
            <path d={SQUARE_A} />
            <path d={SQUARE_B} />
            <path d={STAR} transform="translate(50 50) scale(0.5) translate(-50 -50)" />
            {/* Links to the neighbouring tiles weave the stars into one lattice. */}
            <path d="M0 0 L20.3 20.3 M100 0 L79.7 20.3 M0 100 L20.3 79.7 M100 100 L79.7 79.7 M92 50 H100 M0 50 H8 M50 0 V8 M50 92 V100" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#zellige-${id})`} />
    </svg>
  );
}

/** A single khatam star; `spin` turns it very slowly (disabled with reduced motion). */
export function StarMark({ className = "", spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={`text-champagne ${spin ? "spin-slow" : ""} ${className}`}>
      <g fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d={SQUARE_A} />
        <path d={SQUARE_B} />
        <path d={STAR} strokeWidth="0.3" transform="translate(50 50) scale(0.62) translate(-50 -50)" />
        <circle cx="50" cy="50" r="4" />
      </g>
    </svg>
  );
}

/** Thin gold rule with a small star at its center; the lines draw in when scrolled into view. */
export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-5 ${className}`}>
      <span className="draw-line h-px w-full max-w-48 origin-right bg-gradient-to-l from-champagne/50 to-transparent" />
      <StarMark className="size-5 shrink-0 opacity-70" />
      <span className="draw-line h-px w-full max-w-48 origin-left bg-gradient-to-r from-champagne/50 to-transparent" />
    </div>
  );
}

/**
 * Moroccan arch frame: the content gets a rounded top, with a thin gold outline of the same
 * arch offset behind it.
 */
export function ArchFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-t-full border border-champagne/35 sm:translate-x-4 sm:translate-y-4"
      />
      <div className="h-full overflow-hidden rounded-t-full">{children}</div>
    </div>
  );
}

/** Slow horizontal band of words separated by stars; static when motion is reduced. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-8 font-display text-4xl font-normal whitespace-nowrap text-ivory/80 italic sm:px-12 sm:text-6xl">
            {item}
          </span>
          <StarMark className="size-6 shrink-0 opacity-60 sm:size-8" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-ivory/10 py-8 sm:py-10" role="region" aria-label={label}>
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Fine gold wavy line with a dot at its crest, drawn under titles. */
export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 24" className={`h-6 w-48 text-champagne sm:w-60 ${className}`} fill="none">
      <path
        d="M2 14 C 22 4, 38 4, 58 12 S 98 22, 120 12 S 162 2, 182 12 S 218 20, 238 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

/** Solid eight-pointed star, used as a bullet. */
export function StarBullet({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={`text-gold-soft ${className}`} fill="currentColor">
      <path d={SQUARE_A} />
      <path d={SQUARE_B} />
    </svg>
  );
}
