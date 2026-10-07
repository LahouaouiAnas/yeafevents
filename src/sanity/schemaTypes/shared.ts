import { defineArrayMember, defineField, defineType } from "sanity";
import { locales } from "@/i18n/config";
import { categoryKeys, serviceKeys } from "@/lib/routes";

/**
 * Field building blocks shared by every document. Each translatable field is an object
 * with one entry per locale, so French and English stay side by side in the Studio.
 */

const localeTitles = { fr: "Français", en: "English" } as const;

export const localeString = defineType({
  name: "localeString",
  title: "Texte court (FR / EN)",
  type: "object",
  fields: locales.map((locale) => defineField({ name: locale, title: localeTitles[locale], type: "string" })),
});

export const localeText = defineType({
  name: "localeText",
  title: "Texte (FR / EN)",
  type: "object",
  fields: locales.map((locale) => defineField({ name: locale, title: localeTitles[locale], type: "text", rows: 3 })),
});

/** Paragraphs, H2 headings and bullet lists: what the site's RichText renderer supports. */
export const localeRichText = defineType({
  name: "localeRichText",
  title: "Contenu (FR / EN)",
  type: "object",
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeTitles[locale],
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Titre", value: "h2" },
          ],
          lists: [{ title: "Liste à puces", value: "bullet" }],
          marks: { decorators: [], annotations: [] },
        }),
      ],
    }),
  ),
});

/** One URL slug per language; leave a language empty to not publish that version. */
export const localeSlug = defineType({
  name: "localeSlug",
  title: "Adresse de la page (FR / EN)",
  type: "object",
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeTitles[locale],
      type: "slug",
      options: { source: (doc: Record<string, unknown>) => (doc.title as Record<string, string> | undefined)?.[locale] ?? "" },
    }),
  ),
});

/** Image with a localized description, required for accessibility and SEO. */
export const localizedImage = defineType({
  name: "localizedImage",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Description de la photo (FR / EN)",
      description: "Ce que montre la photo, pour Google et les personnes malvoyantes.",
      type: "localeString",
    }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Référencement (Google)",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Titre Google", type: "localeString" }),
    defineField({ name: "description", title: "Description Google", type: "localeText" }),
    defineField({ name: "noindex", title: "Masquer de Google", type: "boolean", initialValue: false }),
  ],
});

const categoryTitles: Record<(typeof categoryKeys)[number], string> = {
  wedding: "Mariage",
  privateParty: "Soirée privée",
  birthday: "Anniversaire",
  festival: "Festival",
  seminar: "Séminaire",
};

export const categoryOptions = categoryKeys.map((value) => ({ title: categoryTitles[value], value }));

const serviceTitles: Record<(typeof serviceKeys)[number], string> = {
  teamBuilding: "Team building",
  entertainment: "Artistes & animation",
  production: "Production",
};

export const serviceOptions = serviceKeys.map((value) => ({ title: serviceTitles[value], value }));
