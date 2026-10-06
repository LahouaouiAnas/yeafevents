import type { Locale } from "@/i18n/config";
import type { ImageAsset, VideoAsset } from "@/lib/content/types";
import type { CategoryKey } from "@/lib/routes";
import { getImage, getVideo, type ImageId, type VideoId } from "./media";

/**
 * Home hero carousel: an editorial selection of real photos (and one video), one per world.
 * Positions frame the subject when a photo is cropped to the screen's shape; portrait
 * photos (1320 px wide) are cropped to a horizontal band on wide screens.
 */
type HeroSlideEntry = {
  id: string;
  /** World the slide illustrates; omitted for the brand-experience slide. */
  category?: CategoryKey;
  desktop: ImageId;
  /** Portrait alternative for phones; defaults to `desktop`. */
  mobile?: ImageId;
  desktopPosition?: string;
  mobilePosition?: string;
  /** Large screens only; the photo stays underneath as fallback. */
  video?: VideoId;
  videoPosition?: string;
  /** Extra darkening for bright photos, so the text stays readable. */
  overlay: "soft" | "strong";
  /** Needed when desktop and mobile show different photos. */
  alt?: Record<Locale, string>;
};

const slides: HeroSlideEntry[] = [
  {
    id: "experience",
    desktop: "candlelitDinner",
    mobile: "poolNight",
    desktopPosition: "42% center",
    video: "heroDusk",
    videoPosition: "50% 62%",
    overlay: "soft",
    alt: {
      fr: "Bassin illuminé de bougies et de lanternes devant un pavillon de lumières, à la tombée de la nuit",
      en: "Pool lit by candles and lanterns beside a pavilion of lights at nightfall",
    },
  },
  { id: "wedding", category: "wedding", desktop: "weddingPavilion", desktopPosition: "center 62%", overlay: "strong" },
  { id: "private-party", category: "privateParty", desktop: "liveMusicians", desktopPosition: "center 35%", overlay: "soft" },
  { id: "festival", category: "festival", desktop: "concertStage", desktopPosition: "center 52%", overlay: "soft" },
  {
    id: "seminar",
    category: "seminar",
    desktop: "congressHall",
    mobile: "congressStage",
    mobilePosition: "center 40%",
    overlay: "strong",
    alt: {
      fr: "Séminaire en salle plénière, entre écrans LED, scène et éclairage bleu",
      en: "Seminar in a plenary hall, with LED screens, stage and blue lighting",
    },
  },
];

export type HeroSlide = {
  id: string;
  category?: CategoryKey;
  desktop: ImageAsset;
  mobile: ImageAsset;
  desktopPosition: string;
  mobilePosition: string;
  video?: VideoAsset;
  videoPosition: string;
  overlay: "soft" | "strong";
  alt: string;
};

export function getHeroSlides(locale: Locale): HeroSlide[] {
  return slides.map((slide) => {
    const desktop = getImage(slide.desktop, locale);
    return {
      id: slide.id,
      category: slide.category,
      desktop,
      mobile: slide.mobile ? getImage(slide.mobile, locale) : desktop,
      desktopPosition: slide.desktopPosition ?? "center",
      mobilePosition: slide.mobilePosition ?? "center",
      video: slide.video ? getVideo(slide.video, locale) : undefined,
      videoPosition: slide.videoPosition ?? "center",
      overlay: slide.overlay,
      alt: slide.alt?.[locale] ?? desktop.alt,
    };
  });
}
