import { ArtDirectedImage } from "@/components/media/ArtDirectedImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { HeroSlide } from "@/content/hero";
import { HeroCarousel, type CarouselLabels } from "./HeroCarousel";

type HomeHeroProps = {
  brand: string;
  /** SEO part of the H1, set small. */
  kicker: string;
  /** Display part of the H1. */
  title: string;
  place: string;
  slides: (HeroSlide & { label: string; href?: string })[];
  labels: CarouselLabels;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

/**
 * Home hero: a stable message (who, what, where, how to reach us) over a carousel of real
 * event photos. Only the first slide's photo is a high-priority (LCP) image.
 */
export function HomeHero({ brand, kicker, title, place, slides, labels, primaryCta, secondaryCta }: HomeHeroProps) {
  return (
    <HeroCarousel
      labels={labels}
      slides={slides.map((slide, index) => ({
        id: slide.id,
        label: slide.label,
        href: slide.href,
        overlay: slide.overlay,
        video: slide.video ? { src: slide.video.src, type: slide.video.type, position: slide.videoPosition } : undefined,
        media: (
          <ArtDirectedImage
            mobile={slide.mobile}
            desktop={slide.desktop}
            alt={slide.alt}
            mobilePosition={slide.mobilePosition}
            desktopPosition={slide.desktopPosition}
            priority={index === 0}
          />
        ),
      }))}
    >
      <p className="eyebrow text-ivory/80">{brand}</p>
      <h1 className="mt-5 max-w-4xl sm:mt-6">
        <span className="block text-[0.7rem] tracking-[0.2em] text-ivory/70 uppercase sm:text-sm">{kicker}</span>
        <span className="mt-3 block font-display text-[2.35rem] leading-[1.04] font-light text-balance sm:mt-4 sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
          {title}
        </span>
      </h1>
      <p className="mt-4 text-xs tracking-[0.3em] text-ivory/60 uppercase sm:mt-6">{place}</p>
      <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
        <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
        <ButtonLink href={secondaryCta.href} variant="outline">
          {secondaryCta.label}
        </ButtonLink>
      </div>
    </HeroCarousel>
  );
}
