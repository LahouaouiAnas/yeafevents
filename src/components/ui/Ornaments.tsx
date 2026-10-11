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

/** Outline of the pointed arch drawn by the `.arch` utility, same proportions. */
const ARCH = "M0 100 V40 C0 22 20 10 50 0 C80 10 100 22 100 40 V100 Z";

/** Thin gold outline of the pointed arch, stretched to its box (the stroke keeps its width). */
export function ArchOutline({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none text-champagne ${className}`}>
      <path d={ARCH} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * Pointed Moroccan arch frame: the content is cut to the arch, with a thin gold outline of the
 * same arch offset behind it.
 */
export function ArchFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate ${className}`}>
      <ArchOutline className="absolute inset-0 -z-10 size-full translate-x-3 translate-y-3 opacity-50 sm:translate-x-4 sm:translate-y-4" />
      <div className="arch h-full">{children}</div>
    </div>
  );
}

/** Short gold rule ending in a small solid star, drawn under titles. */
export function GoldRule({ className = "", centered = false }: { className?: string; centered?: boolean }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 ${centered ? "justify-center" : ""} ${className}`}>
      {centered && <span className="h-px w-14 bg-gradient-to-l from-champagne to-transparent" />}
      <StarBullet className="size-3 shrink-0" />
      <span className={`h-px bg-gradient-to-r from-champagne to-transparent ${centered ? "w-14" : "w-20"}`} />
    </div>
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
