import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The home page: one document with a fixed ID (`homePage`), created by the site itself.
 * Every field is optional: an empty one keeps the text or photo the site shipped with.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  groups: [
    { name: "hero", title: "Haut de page", default: true },
    { name: "intro", title: "L'agence" },
    { name: "worlds", title: "Nos univers" },
    { name: "moments", title: "Quelques moments" },
    { name: "why", title: "Pourquoi Yeaf" },
    { name: "cta", title: "Appel final" },
    { name: "seo", title: "Google" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Grand titre (1re ligne)", type: "localeString", group: "hero" }),
    defineField({ name: "heroAccent", title: "Grand titre (2e ligne, en italique doré)", type: "localeString", group: "hero" }),
    defineField({ name: "heroKicker", title: "Petite ligne au-dessus du titre", type: "localeString", group: "hero" }),
    defineField({ name: "heroText", title: "Texte de présentation", type: "localeText", group: "hero" }),
    defineField({ name: "heroPhoto", title: "Photo (en arche, à droite)", type: "localizedImage", group: "hero" }),

    // "L'agence" and "Pourquoi Yeaf" are hidden on the site by default (Sections du site).
    defineField({ name: "introEyebrow", title: "Petit titre", type: "localeString", group: "intro" }),
    defineField({ name: "introText", title: "Texte principal", type: "localeText", group: "intro" }),
    defineField({ name: "introNote", title: "Note (sous le texte)", type: "localeText", group: "intro" }),
    defineField({ name: "introPhoto", title: "Photo (en arche)", type: "localizedImage", group: "intro" }),

    defineField({ name: "worldsEyebrow", title: "Petit titre", type: "localeString", group: "worlds" }),
    defineField({ name: "worldsTitle", title: "Titre", type: "localeString", group: "worlds" }),

    defineField({ name: "momentsEyebrow", title: "Petit titre", type: "localeString", group: "moments" }),
    defineField({ name: "momentsTitle", title: "Titre", type: "localeString", group: "moments" }),
    defineField({
      name: "moments",
      title: "Photos",
      description: "3 ou 6 photos. La 2e (et la 5e) sont affichées en format paysage.",
      type: "array",
      group: "moments",
      of: [
        defineArrayMember({
          type: "object",
          name: "moment",
          fields: [
            defineField({ name: "photo", title: "Photo", type: "localizedImage" }),
            defineField({ name: "caption", title: "Légende", type: "localeString" }),
          ],
          preview: { select: { title: "caption.fr", media: "photo" } },
        }),
      ],
      validation: (rule) =>
        rule.custom((items) =>
          !items || items.length === 0 || items.length === 3 || items.length === 6 ? true : "Mettez 3 ou 6 photos.",
        ),
    }),

    defineField({ name: "whyEyebrow", title: "Petit titre", type: "localeString", group: "why" }),
    defineField({ name: "whyTitle", title: "Titre", type: "localeString", group: "why" }),
    defineField({
      name: "whySteps",
      title: "Étapes",
      type: "array",
      group: "why",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString" }),
            defineField({ name: "text", title: "Texte", type: "localeText" }),
          ],
          preview: { select: { title: "title.fr", subtitle: "text.fr" } },
        }),
      ],
    }),
    defineField({ name: "whyPhoto", title: "Photo (en arche)", type: "localizedImage", group: "why" }),

    defineField({ name: "ctaTitle", title: "Titre", type: "localeString", group: "cta" }),
    defineField({ name: "ctaText", title: "Texte", type: "localeText", group: "cta" }),
    defineField({ name: "ctaPhoto", title: "Photo de fond", type: "localizedImage", group: "cta" }),

    defineField({ name: "seoTitle", title: "Titre Google", type: "localeString", group: "seo" }),
    defineField({ name: "seoDescription", title: "Description Google", type: "localeText", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
