import type { Locale } from "@/i18n/config";
import type { CategoryKey } from "@/lib/routes";

/**
 * Starting structure of the "Formules & prix" tab, imported once per event type into Sanity
 * (src/lib/cms/seed.ts). Deliberately WITHOUT prices: a formula stays off the site until the
 * agency enters its own price (or ticks "Prix sur demande") in the Studio, and reviews what
 * is included.
 */

type Localized = Record<Locale, string>;

export type FormulaDraft = { name: Localized; featured?: boolean; inclusions: Localized[] };

export type PricingDraft = { title: Localized; note: Localized; formulas: FormulaDraft[] };

const tiers = {
  essential: { fr: "Formule Essentielle", en: "Essential" },
  signature: { fr: "Formule Signature", en: "Signature" },
  prestige: { fr: "Formule Prestige", en: "Prestige" },
} satisfies Record<string, Localized>;

const item = (fr: string, en: string): Localized => ({ fr, en });

const coordination = item("Coordination sur place", "On-site coordination");
const decor = item("Décoration et mise en lumière", "Decoration and lighting");
const soundDj = item("Sonorisation et DJ", "Sound system and DJ");
const venue = item("Recherche et réservation du lieu", "Venue search and booking");
const catering = item("Traiteur, service et bar", "Catering, service and bar");
const entertainment = item("Animation artistique", "Live entertainment");
const scenography = item("Scénographie sur mesure", "Bespoke scenography");
const transfers = item("Accueil et transferts des invités", "Guest welcome and transfers");
const planning = item("Planification complète, de l'idée au jour J", "Full planning, from first idea to the day itself");

const note = item(
  "Prix de départ, ajustés ensuite à votre date, à votre lieu et au nombre d'invités.",
  "Starting prices, then adjusted to your date, venue and number of guests.",
);

export const pricingDrafts: Record<CategoryKey, PricingDraft> = {
  wedding: {
    title: item("Nos formules mariage", "Our wedding packages"),
    note,
    formulas: [
      { name: tiers.essential, inclusions: [coordination, decor, soundDj] },
      { name: tiers.signature, featured: true, inclusions: [venue, scenography, catering, soundDj, coordination] },
      { name: tiers.prestige, inclusions: [planning, venue, scenography, catering, entertainment, transfers] },
    ],
  },
  privateParty: {
    title: item("Nos formules soirée privée", "Our private party packages"),
    note,
    formulas: [
      { name: tiers.essential, inclusions: [decor, soundDj, coordination] },
      { name: tiers.signature, featured: true, inclusions: [venue, decor, catering, soundDj, coordination] },
      { name: tiers.prestige, inclusions: [planning, venue, scenography, catering, entertainment, transfers] },
    ],
  },
  birthday: {
    title: item("Nos formules anniversaire", "Our birthday packages"),
    note,
    formulas: [
      { name: tiers.essential, inclusions: [decor, soundDj, coordination] },
      { name: tiers.signature, featured: true, inclusions: [venue, decor, catering, soundDj, coordination] },
      { name: tiers.prestige, inclusions: [planning, venue, scenography, catering, entertainment] },
    ],
  },
  festival: {
    title: item("Nos formules festival", "Our festival packages"),
    note: item(
      "Prix de départ, ajustés ensuite à la jauge, au site et à la durée de l'événement.",
      "Starting prices, then adjusted to capacity, site and duration.",
    ),
    formulas: [
      { name: tiers.essential, inclusions: [item("Son et lumière", "Sound and lighting"), item("Régie technique", "Technical management")] },
      {
        name: tiers.signature,
        featured: true,
        inclusions: [item("Scène, son et lumière", "Stage, sound and lighting"), item("Régie technique", "Technical management"), scenography, coordination],
      },
      {
        name: tiers.prestige,
        inclusions: [planning, item("Scène, son, lumière et écrans LED", "Stage, sound, lighting and LED screens"), scenography, entertainment, coordination],
      },
    ],
  },
  seminar: {
    title: item("Nos formules séminaire", "Our seminar packages"),
    note: item(
      "Prix de départ, ajustés ensuite au nombre de participants, à la durée et au lieu.",
      "Starting prices, then adjusted to the number of participants, duration and venue.",
    ),
    formulas: [
      { name: tiers.essential, inclusions: [item("Salle et équipement audiovisuel", "Meeting room and audiovisual equipment"), item("Pauses café", "Coffee breaks"), coordination] },
      {
        name: tiers.signature,
        featured: true,
        inclusions: [venue, item("Salle et équipement audiovisuel", "Meeting room and audiovisual equipment"), item("Pauses café et déjeuners", "Coffee breaks and lunches"), item("Team building", "Team building"), coordination],
      },
      {
        name: tiers.prestige,
        inclusions: [planning, item("Scène, écrans LED et captation vidéo", "Stage, LED screens and video capture"), item("Soirée de gala", "Gala evening"), item("Team building", "Team building"), transfers],
      },
    ],
  },
};
