"use client";

import { useEffect, useRef, useState } from "react";

type VideoLayerProps = {
  src: string;
  type: string;
  /** "afterLoad": hero video, started once the page has loaded (keeps LCP on the poster).
   *  "inView": started only while visible, paused when scrolled away. */
  trigger: "afterLoad" | "inView";
  /** Below this viewport width the poster alone is shown (source videos are 9–16 MB). */
  minWidth?: number;
  objectPosition?: string;
};

function canPlayAmbientVideo(minWidth: number): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    window.matchMedia(`(min-width: ${minWidth}px)`).matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !connection?.saveData
  );
}

/** Muted ambient video layered over a server-rendered poster. Decorative: the poster carries the alt. */
export function VideoLayer({ src, type, trigger, minWidth = 1024, objectPosition = "center" }: VideoLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canPlayAmbientVideo(minWidth)) return;

    if (trigger === "afterLoad") {
      const start = () => setMounted(true);
      if (document.readyState === "complete") {
        const id = window.setTimeout(start, 300);
        return () => window.clearTimeout(id);
      }
      window.addEventListener("load", start, { once: true });
      return () => window.removeEventListener("load", start);
    }

    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setMounted(true);
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [trigger, minWidth]);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0">
      {mounted && (
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setVisible(true)}
        >
          <source src={src} type={type} />
        </video>
      )}
    </div>
  );
}
