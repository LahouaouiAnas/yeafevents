import type { Locale } from "@/i18n/config";
import type { ShowcaseItem } from "@/lib/content/types";
import type { CategoryKey } from "@/lib/routes";
import { getImage, getVideo, type ImageId, type VideoId } from "./media";

/**
 * Real events documented only by their photos and videos. Titles and descriptions state
 * what the media shows — no venue, city, date or client, which are not known.
 * Category links follow the folders the media were delivered in (e.g. /weedings).
 */
type ShowcaseEntry = {
  id: string;
  title: Record<Locale, string>;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  cover?: ImageId;
  gallery: ImageId[];
  video?: VideoId;
  category?: CategoryKey;
};

const entries: ShowcaseEntry[] = [
  {
    id: "reception-sous-verriere",
    title: { fr: "Une réception sous verrière", en: "A reception under glass" },
    label: { fr: "Mariage", en: "Wedding" },
    description: {
      fr: "Une longue table dressée de bougies et de fleurs, des suspensions en rotin et une lumière pensée pour accompagner la soirée.",
      en: "A long table dressed with candles and flowers, rattan pendants and lighting designed to carry the evening.",
    },
    cover: "weddingTable",
    gallery: ["weddingPavilion", "pavilionStage"],
    category: "wedding",
  },
  {
    id: "diner-ciel-de-lumieres",
    title: { fr: "Un dîner sous un ciel de lumières", en: "A dinner beneath a sky of lights" },
    label: { fr: "Scénographie & art de la table", en: "Set design & tablescape" },
    description: {
      fr: "Des rideaux de guirlandes lumineuses, un bassin parsemé de bougies flottantes et des lanternes pour accompagner la tombée de la nuit.",
      en: "Curtains of string lights, a pool scattered with floating candles and lanterns to welcome nightfall.",
    },
    cover: "candlelitDinner",
    gallery: ["poolsideDusk", "stringLightsTable"],
    video: "lightPavilion",
    category: "wedding",
  },
  {
    id: "soirees-live",
    title: { fr: "Des soirées en live", en: "Live evenings" },
    label: { fr: "Animation artistique", en: "Entertainment" },
    description: {
      fr: "Des musiciens et un chanteur au plus près des invités, une lumière tamisée et une salle qui finit par danser.",
      en: "Musicians and a singer performing close to the guests, soft light and a room that ends up dancing.",
    },
    cover: "liveSinger",
    gallery: ["liveMusicians"],
    video: "dancingGuests",
    category: "privateParty",
  },
  {
    id: "scenes-et-concerts",
    title: { fr: "Scènes & concerts", en: "Stages & concerts" },
    label: { fr: "Production événementielle", en: "Event production" },
    description: {
      fr: "Une structure scénique illuminée face au public, une cabine DJ encadrée de projecteurs : la production au service de l'énergie du live.",
      en: "An illuminated stage structure facing the crowd, a DJ booth framed by spotlights: production in service of live energy.",
    },
    cover: "concertStage",
    gallery: ["djCourtyard"],
    category: "festival",
  },
  {
    id: "congres-national",
    title: { fr: "Un congrès national", en: "A national congress" },
    label: { fr: "Congrès & conférence", en: "Congress & conference" },
    description: {
      fr: "Une salle plénière mise en lumière, une scène encadrée d'écrans LED et une régie technique dédiée à la captation et à la diffusion.",
      en: "A plenary hall shaped by light, a stage framed by LED screens and a technical control room dedicated to filming and broadcast.",
    },
    cover: "congressAudience",
    gallery: ["congressHall", "congressStage"],
    category: "seminar",
  },
];

export function getShowcaseContent(locale: Locale): ShowcaseItem[] {
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title[locale],
    label: entry.label[locale],
    description: entry.description[locale],
    cover: entry.cover ? getImage(entry.cover, locale) : undefined,
    gallery: entry.gallery.map((id) => getImage(id, locale)),
    video: entry.video ? getVideo(entry.video, locale) : undefined,
    category: entry.category,
  }));
}
