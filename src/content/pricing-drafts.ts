import type { Locale } from "@/i18n/config";
import type { CategoryKey } from "@/lib/routes";

/**
 * Starting content of the "Formules & prix" tab, imported once per event type into Sanity
 * (src/lib/cms/seed.ts). Weddings carry the agency's own plans and prices (Yeaf Events wedding
 * guide for UK couples); prices are only shown once "Afficher les prix" is ticked. The other
 * types have no price yet: a formula stays off the site until the agency enters its own price
 * (or ticks "Afficher sans prix") in the Studio.
 */

type Localized = Record<Locale, string>;

export type FormulaDraft = {
  name: Localized;
  guestsMin?: number;
  guestsMax?: number;
  audience?: Localized;
  priceGbp?: number;
  featured?: boolean;
  inclusions: Localized[];
  extras?: Localized;
};

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
  "Chaque formule est ensuite ajustée à votre date, à votre lieu et au nombre d'invités.",
  "Each package is then tailored to your date, venue and number of guests.",
);

/** Wedding introduction, without prices (they are hidden unless "Afficher les prix" is ticked). */
const weddingNote = item(
  "Chaque formule est ajustée à votre date, à votre lieu, au nombre d'invités et aux prestations choisies. Hors vols, hébergement et transport des invités. Votre proposition personnalisée confirme le lieu, les prestations et le prix.",
  "Each package is tailored to your date, venue, guest count and selected services. Guest flights, accommodation and transport are not included. Your personalised proposal confirms the venue, services and price.",
);

/** Wedding introduction shipped with the guide, which mentioned "indicative starting prices". */
export const formerWeddingNote =
  "Prix de départ indicatifs, selon la date, le lieu, le nombre d'invités et les prestations choisies. Hors vols, hébergement et transport des invités. Votre proposition personnalisée confirme le lieu, les prestations, les taxes et le prix final.";

/** The three wedding plans of the agency's guide, with its indicative starting prices in GBP. */
const weddingGuide: PricingDraft = {
  title: item("Nos formules mariage", "Our wedding packages"),
  note: weddingNote,
  formulas: [
    {
      name: tiers.essential,
      guestsMin: 60,
      guestsMax: 80,
      audience: item("Une journée et une soirée", "One wedding day and evening"),
      priceGbp: 10900,
      inclusions: [
        item("Riad privatisé ou villa standard", "Private riad or standard villa"),
        item("Repas marocain en trois services et personnel de service", "Three-course Moroccan meal and service staff"),
        item("Décoration de table : bougies et fleurs simples", "Table styling with candles and simple flowers"),
        item("DJ, sonorisation et éclairage", "DJ with sound and lighting"),
        item("Organisation à distance et coordination le jour J", "Remote planning and wedding-day coordination"),
      ],
      extras: item(
        "En option : negafa et location de tenues, photographe, vidéaste, orchestre live et navettes pour les invités.",
        "Optional: negafa and bridal outfit hire, photographer, videographer, live band and guest shuttles.",
      ),
    },
    {
      name: tiers.signature,
      guestsMin: 100,
      guestsMax: 150,
      audience: item("Location de la villa sur deux jours", "Two-day villa hire"),
      priceGbp: 21030,
      featured: true,
      inclusions: [
        item("Villa premium avec jardin et piscine", "Premium villa with garden and pool"),
        item("Repas de mariage et cocktail de bienvenue", "Wedding meal and welcome drinks reception"),
        item("Negafa avec trois tenues et entrée en amariya", "Negafa with three bridal outfits and an amariya entrance"),
        item("Décoration florale et mobilier lounge", "Floral design and lounge furniture"),
        item("Photographe et vidéaste", "Photographer and videographer"),
        item("Orchestre live et DJ", "Live band and DJ"),
        item("Organisation à distance et équipe sur place", "Remote planning and an on-site team"),
      ],
      extras: item(
        "La location sur deux jours n'inclut pas automatiquement deux jours de traiteur ni l'hébergement des invités. Soirée henné ou dîner de bienvenue : sur devis.",
        "Two-day venue hire does not automatically include two days of catering or guest accommodation. A henna evening or welcome dinner is quoted separately.",
      ),
    },
    {
      name: tiers.prestige,
      guestsMin: 150,
      guestsMax: 250,
      audience: item("Deux à trois jours de célébrations", "Two to three days of celebrations"),
      priceGbp: 41390,
      inclusions: [
        item("Domaine d'exception ou palais événementiel, location sur trois jours", "Exceptional estate or event palace with three-day hire"),
        item("Soirée henné, mariage et brunch d'adieu", "Henna evening, wedding and farewell brunch"),
        item("Traiteur gastronomique", "Gourmet catering"),
        item("Décoration sur mesure", "Bespoke styling"),
        item("Negafa premium avec cinq à sept tenues", "Premium negafa with five to seven outfits"),
        item("Amariya et dakka (tambours traditionnels)", "Amariya and traditional drummers"),
        item("Équipe photo et film avec drone", "Photo and film team with drone"),
        item("Animations live", "Live entertainment"),
        item("Trois coordinateurs et conciergerie pour les invités", "Three coordinators and guest concierge support"),
      ],
      extras: item(
        "Feux d'artifice en option, selon l'autorisation du lieu et la disponibilité.",
        "Fireworks are optional, subject to venue permission and availability.",
      ),
    },
  ],
};

/**
 * The first, price-less wedding formulas (French names and inclusions) imported before the
 * guide existed. A wedding tab still holding exactly these was never edited, so it is safely
 * replaced by the guide (seed.ts).
 */
export const formerWeddingDraft = [
  ["Formule Essentielle", ["Coordination sur place", "Décoration et mise en lumière", "Sonorisation et DJ"]],
  [
    "Formule Signature",
    ["Recherche et réservation du lieu", "Scénographie sur mesure", "Traiteur, service et bar", "Sonorisation et DJ", "Coordination sur place"],
  ],
  [
    "Formule Prestige",
    [
      "Planification complète, de l'idée au jour J",
      "Recherche et réservation du lieu",
      "Scénographie sur mesure",
      "Traiteur, service et bar",
      "Animation artistique",
      "Accueil et transferts des invités",
    ],
  ],
] as const;

export const pricingDrafts: Record<CategoryKey, PricingDraft> = {
  wedding: weddingGuide,
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
      "Chaque formule est ensuite ajustée à la jauge, au site et à la durée de l'événement.",
      "Each package is then tailored to capacity, site and duration.",
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
      "Chaque formule est ensuite ajustée au nombre de participants, à la durée et au lieu.",
      "Each package is then tailored to the number of participants, duration and venue.",
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
