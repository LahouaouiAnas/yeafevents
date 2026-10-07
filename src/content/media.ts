import type { Locale } from "@/i18n/config";
import type { ImageAsset, VideoAsset } from "@/lib/content/types";

/**
 * Single registry of the media shown on the site — all from /public/media.
 * Migrating to Cloudinary/Sanity only means changing `path` here.
 *
 * Rules: files in /public/about are reference documents and are never referenced;
 * no image is ever extracted from a video. A video poster, when present, is a real
 * photo of the same scene.
 */

type ImageEntry = {
  path: string;
  /** Displayed dimensions (after EXIF orientation). */
  width: number;
  height: number;
  alt: Record<Locale, string>;
};

const images = {
  // event managment/
  candlelitDinner: {
    path: "/media/events/event managment/event design 3.jpeg",
    width: 5712,
    height: 4284,
    alt: {
      fr: "Longue table de dîner sous un rideau de lumières, reflétée dans un bassin aux bougies flottantes",
      en: "Long dinner table beneath a curtain of lights, reflected in a pool of floating candles",
    },
  },
  poolsideDusk: {
    path: "/media/events/event managment/event design 1.jpeg",
    width: 4032,
    height: 3024,
    alt: {
      fr: "Dîner dressé sous un pavillon de lumières, au bord d'un bassin éclairé à la bougie au crépuscule",
      en: "Dinner set beneath a pavilion of lights beside a candlelit pool at dusk",
    },
  },
  stringLightsTable: {
    path: "/media/events/event managment/IMG_2242.jpg",
    width: 1320,
    height: 1878,
    alt: {
      fr: "Longue table dressée sous un ciel de guirlandes lumineuses et de lustres à bougies",
      en: "Long table set beneath a sky of string lights and candle chandeliers",
    },
  },
  // Rotated web export of "event design 2.jpeg" (same file as weedings/weeding.jpeg),
  // whose original is stored sideways without an EXIF orientation tag.
  lightCanopyTable: {
    path: "/media/events/event managment/light-canopy-table.jpg",
    width: 1800,
    height: 2400,
    alt: {
      fr: "Longue table dressée sous une canopée de guirlandes lumineuses, sur une terrasse dominant la ville la nuit",
      en: "Long table set beneath a canopy of fairy lights, on a terrace overlooking the city at night",
    },
  },
  // weedings/
  weddingTable: {
    path: "/media/events/weedings/IMG_2248.jpg",
    width: 1320,
    height: 2235,
    alt: {
      fr: "Table de mariage dressée de bougies et de compositions florales, sous des jeux de lumière",
      en: "Wedding table set with candles and floral arrangements, under playful lighting",
    },
  },
  weddingPavilion: {
    path: "/media/events/weedings/IMG_2249.jpg",
    width: 1320,
    height: 2280,
    alt: {
      fr: "Réception de mariage sous une verrière, avec suspensions en rotin, fleurs et chaises blanches",
      en: "Wedding reception under a glass pavilion, with rattan pendants, flowers and white chairs",
    },
  },
  pavilionStage: {
    path: "/media/events/weedings/IMG_2247.jpg",
    width: 1320,
    height: 2035,
    alt: {
      fr: "Projecteurs et colonnes LED installés sous une verrière avant une réception",
      en: "Spotlights and LED columns set up under a glass pavilion before a reception",
    },
  },
  poolNight: {
    path: "/media/events/weedings/IMG_2244.jpg",
    width: 1320,
    height: 2084,
    alt: {
      fr: "Bassin de nuit ponctué de lanternes et d'une sphère lumineuse, près d'un pavillon éclairé",
      en: "Pool at night dotted with lanterns and a glowing sphere, beside a lit pavilion",
    },
  },
  liveSinger: {
    path: "/media/events/weedings/IMG_2253.jpg",
    width: 1320,
    height: 2016,
    alt: {
      fr: "Chanteur en live au milieu des invités, sous des abat-jour rouges",
      en: "Live singer performing among guests beneath red lampshades",
    },
  },
  // Same photo as private parties/IMG_2243.jpg; this export is the sharper one.
  djCourtyard: {
    path: "/media/events/weedings/IMG_2243.jpg",
    width: 1320,
    height: 2336,
    alt: {
      fr: "DJ derrière ses platines, encadré d'un cercle de projecteurs dans la cour d'une kasbah",
      en: "DJ at the decks, framed by a ring of spotlights in a kasbah courtyard",
    },
  },
  // private parties/
  liveMusicians: {
    path: "/media/events/private parties/IMG_2245.jpg",
    width: 1320,
    height: 2309,
    alt: {
      fr: "Deux musiciens jouant en live, assis sur des tapis dans une ambiance tamisée",
      en: "Two musicians playing live, seated on rugs in soft lighting",
    },
  },
  concertStage: {
    path: "/media/events/private parties/IMG_2250.jpg",
    width: 1320,
    height: 2140,
    alt: {
      fr: "Public face à une scène de concert sous une structure lumineuse, en pleine nuit",
      en: "Crowd facing a concert stage beneath an illuminated truss structure at night",
    },
  },
  // seminairs/
  congressStage: {
    path: "/media/events/seminairs/seminaire1.jpeg",
    width: 4284,
    height: 5712,
    alt: {
      fr: "Orateur sur scène lors d'un congrès, entre écrans LED et éclairage scénique",
      en: "Speaker on stage at a congress, framed by LED screens and stage lighting",
    },
  },
  congressAudience: {
    path: "/media/events/seminairs/seminaire2.jpeg",
    width: 4032,
    height: 3024,
    alt: {
      fr: "Salle de conférence comble face à l'écran géant d'un congrès national",
      en: "Packed conference room facing the giant screen of a national congress",
    },
  },
  congressHall: {
    path: "/media/events/seminairs/seminaire3.jpeg",
    width: 5712,
    height: 4284,
    alt: {
      fr: "Salle plénière d'un séminaire éclairée en bleu, avec régie technique et captation vidéo",
      en: "Seminar plenary hall in blue light, with technical control desk and video capture",
    },
  },
  // Logo shown in the header and footer (square file: monogram + wordmark underneath).
  // logo_yeaf_side.png (2000x900) is the horizontal alternative.
  logo: {
    path: "/media/logo/logo_yeaf.png",
    width: 2000,
    height: 2000,
    alt: { fr: "Yeaf Events", en: "Yeaf Events" },
  },
  // Square monogram: preferred by search engines for the Organization logo.
  logoMark: {
    path: "/media/logo/logo_yeaf.png",
    width: 2000,
    height: 2000,
    alt: { fr: "Yeaf Events", en: "Yeaf Events" },
  },
} as const satisfies Record<string, ImageEntry>;

export type ImageId = keyof typeof images;

type VideoEntry = {
  path: string;
  /** Source weight, kept to make loading decisions explicit. */
  megabytes: number;
  /** A real photo of the same scene, never a frame of the video. */
  poster?: ImageId;
};

const videos = {
  /** hero/hero1.mp4 — 1080x1920, 5.9 s, 9.7 MB. Same pool scene as `candlelitDinner`. */
  heroDusk: { path: "/media/hero/hero1.mp4", megabytes: 9.7, poster: "candlelitDinner" },
  /** hero/hero2.mp4 — 1080x1920, 8.6 s, 9.5 MB. Same venue as `poolNight`. */
  lightPavilion: { path: "/media/hero/hero2.mp4", megabytes: 9.5, poster: "poolNight" },
  /** private parties/party2.mp4 — 720x1280, 12.8 s, 2.6 MB. No matching photo. */
  dancingGuests: { path: "/media/events/private parties/party2.mp4", megabytes: 2.6 },
} as const satisfies Record<string, VideoEntry>;

export type VideoId = keyof typeof videos;

export function getImage(id: ImageId, locale: Locale): ImageAsset {
  const entry: ImageEntry = images[id];
  return { src: encodeURI(entry.path), width: entry.width, height: entry.height, alt: entry.alt[locale] };
}

export function getVideo(id: VideoId, locale: Locale): VideoAsset {
  const entry: VideoEntry = videos[id];
  return {
    src: encodeURI(entry.path),
    type: "video/mp4",
    poster: entry.poster ? getImage(entry.poster, locale) : undefined,
  };
}

export const logo = { src: encodeURI(images.logo.path), width: images.logo.width, height: images.logo.height };

export const logoMarkPath = encodeURI(images.logoMark.path);
