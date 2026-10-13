/**
 * Every section of the site that can be shown or hidden from the Studio ("Sections du site",
 * fixed document `siteSettings`). Single source for the Studio checkboxes, their defaults and
 * the site: a box never saved keeps its default here.
 */
export const sectionGroups = {
  home: "Page d'accueil",
  category: "Pages d'événement (les 5 types)",
  site: "Menu, pages et boutons",
} as const;

type SectionDefinition = { group: keyof typeof sectionGroups; title: string; description?: string; default: boolean };

export const sectionDefinitions = {
  homeIntro: { group: "home", title: "L'agence (texte et photo)", default: false },
  homeWorlds: { group: "home", title: "Nos univers (cartes des types d'événement)", default: true },
  homeMarquee: { group: "home", title: "Bandeau défilant des types d'événement", default: false },
  homeMoments: { group: "home", title: "Quelques moments (photos)", default: true },
  homeWhy: { group: "home", title: "Pourquoi Yeaf (étapes et photo)", default: false },
  homeCta: { group: "home", title: "Appel final", default: true },

  categoryIntro: { group: "category", title: "Introduction", default: true },
  categoryFormulas: { group: "category", title: "Formules", default: true },
  categoryGallery: { group: "category", title: "Photos (« En images »)", default: true },
  categoryIncludes: { group: "category", title: "Ce que nous prenons en charge et occasions", default: false },
  categoryApproach: { group: "category", title: "Notre méthode (étapes)", default: false },
  categoryTestimonials: {
    group: "category",
    title: "Témoignages",
    description: "Visibles seulement s'il existe des témoignages pour ce type d'événement.",
    default: true,
  },
  categoryRelated: { group: "category", title: "Savoir-faire associés et autres univers", default: false },
  categoryCta: { group: "category", title: "Appel final", default: true },

  packagesPage: {
    group: "site",
    title: "Page Formules",
    description: "Décochée : la page, son lien dans le menu, le pied de page et le bouton de l'accueil disparaissent.",
    default: true,
  },
  whatsappButton: { group: "site", title: "Bouton WhatsApp flottant", default: true },
  contactFaq: { group: "site", title: "Questions fréquentes (page Contact)", default: true },
} as const satisfies Record<string, SectionDefinition>;

export type SectionKey = keyof typeof sectionDefinitions;

export type SiteSections = Record<SectionKey, boolean>;

export const sectionKeys = Object.keys(sectionDefinitions) as SectionKey[];

export const defaultSections = Object.fromEntries(sectionKeys.map((key) => [key, sectionDefinitions[key].default])) as SiteSections;

/** Saved checkboxes over the defaults; anything missing or not a boolean keeps its default. */
export function mergeSections(raw: Partial<Record<string, unknown>> | null | undefined): SiteSections {
  return Object.fromEntries(
    sectionKeys.map((key) => [key, typeof raw?.[key] === "boolean" ? (raw[key] as boolean) : defaultSections[key]]),
  ) as SiteSections;
}
