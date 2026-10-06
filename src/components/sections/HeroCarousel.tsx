"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

export type CarouselSlide = {
  id: string;
  label: string;
  href?: string;
  /** Server-rendered <picture>; only mounted once the slide is about to be shown. */
  media: ReactNode;
  video?: { src: string; type: string; position: string };
  overlay: "soft" | "strong";
};

export type CarouselLabels = {
  /** Localised role description, e.g. "carrousel". */
  carousel: string;
  region: string;
  slide: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
};

type HeroCarouselProps = {
  slides: CarouselSlide[];
  labels: CarouselLabels;
  /** Milliseconds per slide. */
  interval?: number;
  /** Stable hero text and calls to action, shown above every slide. */
  children: ReactNode;
};

const SWIPE_THRESHOLD = 50;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Crossfading hero carousel. The text stays put; only the imagery changes.
 * Auto-advance keeps track of the time left on the current slide, so any pause (focus,
 * hovering the controls, off-screen, hidden tab, pause button) resumes where it stopped.
 */
export function HeroCarousel({ slides, labels, interval = 6500, children }: HeroCarouselProps) {
  const count = slides.length;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const remaining = useRef(interval);
  // Source of truth for navigation, so rapid successive actions never read a stale index.
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoAllowed, setVideoAllowed] = useState(false);
  // After a manual change, the next automatic one waits longer.
  const [calmCycle, setCalmCycle] = useState(false);

  const running = !userPaused && !reducedMotion && !hovered && !focused && inView && pageVisible && count > 1;
  const duration = calmCycle ? interval * 1.6 : interval;

  const step = useCallback(
    (delta: number, manual: boolean) => {
      const next = (activeRef.current + delta + count) % count;
      activeRef.current = next;
      setActive(next);
      setCycle((value) => value + 1);
      setCalmCycle(manual);
      setMounted((previous) => new Set([...previous, next, (next + 1) % count]));
    },
    [count],
  );

  // Browser capabilities and page visibility, read once after hydration.
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    onMotionChange();
    motionQuery.addEventListener("change", onMotionChange);

    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    // Heavy videos and the next slide only start once the page (and its LCP image) has loaded.
    const afterLoad = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      setVideoAllowed(window.matchMedia("(min-width: 1024px)").matches && !motionQuery.matches && !connection?.saveData);
      setMounted((previous) => new Set([...previous, 1 % count]));
    };
    let timer: number | undefined;
    if (document.readyState === "complete") timer = window.setTimeout(afterLoad, 300);
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("load", afterLoad);
      window.clearTimeout(timer);
    };
  }, [count]);

  // Each new slide starts a full cycle (longer right after a manual change)…
  useEffect(() => {
    remaining.current = duration;
  }, [active, cycle, duration]);

  // …and the timer only runs while nothing asks for a pause.
  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now();
    const timer = window.setTimeout(() => step(1, false), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= performance.now() - startedAt;
    };
  }, [running, active, cycle, step]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Only the visible slide's video plays; the others are paused, never left running.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === active && inView && pageVisible) void video.play().catch(() => undefined);
      else video.pause();
    });
  }, [active, inView, pageVisible, videoAllowed, mounted]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") step(1, true);
    if (event.key === "ArrowLeft") step(-1, true);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1, true);
  };

  const current = slides[active];

  return (
    <section
      ref={sectionRef}
      aria-roledescription={labels.carousel}
      aria-label={labels.region}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (pointerStart.current = null)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative isolate flex h-[80svh] min-h-[34rem] max-h-[58rem] touch-pan-y flex-col justify-end overflow-hidden bg-night lg:h-[86svh]"
    >
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription={labels.slide}
              aria-label={`${index + 1} / ${count} — ${slide.label}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out-soft motion-reduce:duration-300 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`absolute inset-0 transition-transform duration-[8000ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  isActive ? "scale-100" : "scale-[1.06]"
                }`}
              >
                {mounted.has(index) && slide.media}
                {slide.video && videoAllowed && mounted.has(index) && (
                  <video
                    ref={(element) => {
                      if (element) videoRefs.current.set(index, element);
                      else videoRefs.current.delete(index);
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: slide.video.position }}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                  >
                    <source src={slide.video.src} type={slide.video.type} />
                  </video>
                )}
              </div>
              <div className={`absolute inset-0 ${slide.overlay === "strong" ? "bg-night/30" : "bg-night/10"}`} />
            </div>
          );
        })}
        {/* Darkest where the text sits (bottom-left), lighter elsewhere so each photo keeps its colour. */}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-night/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/75 via-night/15 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-10">
        {children}

        {/* Hovering the controls (not the whole full-screen hero) pauses the slideshow. */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="mt-8 flex items-center justify-between gap-4 border-t border-ivory/15 pt-4 sm:mt-12 sm:pt-5"
        >
          <p className="min-w-0 truncate text-[0.7rem] tracking-[0.14em] uppercase sm:tracking-[0.2em]">
            {current?.href ? (
              <Link href={current.href} className="text-ivory/80 transition-colors hover:text-ivory">
                {current.label} <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className="text-ivory/60">{current?.label}</span>
            )}
          </p>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <span aria-hidden="true" className="mr-1 font-display text-sm text-ivory/80 tabular-nums sm:mr-3">
              {pad(active + 1)} <span className="text-ivory/35">/ {pad(count)}</span>
            </span>
            <span aria-hidden="true" className="relative mr-4 hidden h-px w-14 overflow-hidden bg-ivory/20 sm:block">
              {!reducedMotion && (
                <span
                  key={`${active}-${cycle}`}
                  className="absolute inset-0 origin-left bg-ivory/80"
                  style={{
                    animation: `hero-progress ${duration}ms linear forwards`,
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
              )}
            </span>
            <button type="button" aria-label={labels.previous} onClick={() => step(-1, true)} className={controlClass}>
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label={userPaused || reducedMotion ? labels.play : labels.pause}
              onClick={() => {
                if (reducedMotion) {
                  setReducedMotion(false);
                  setUserPaused(false);
                } else {
                  setUserPaused((paused) => !paused);
                }
              }}
              className={controlClass}
            >
              <span aria-hidden="true" className="text-[0.6rem] tracking-[0.1em]">
                {userPaused || reducedMotion ? "▶" : "❚❚"}
              </span>
            </button>
            <button type="button" aria-label={labels.next} onClick={() => step(1, true)} className={controlClass}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live={running ? "off" : "polite"} aria-atomic="true">
          {`${active + 1} / ${count} — ${current?.label ?? ""}`}
        </p>
      </div>
    </section>
  );
}

const controlClass =
  "grid h-11 w-11 place-items-center border border-transparent text-ivory/75 transition-colors duration-300 hover:border-ivory/30 hover:text-ivory";
