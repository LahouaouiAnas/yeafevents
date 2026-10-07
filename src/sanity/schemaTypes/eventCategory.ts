import { defineArrayMember, defineField, defineType } from "sanity";
import { categoryOptions, serviceOptions } from "./shared";

/**
 * The five event types (weddings, private parties…). Exactly one document per type, with a
 * fixed ID (`category.<key>`), created by the site itself: the Studio cannot add or delete
 * them. The page address and the video stay in the code. An empty field falls back to the
 * text the site shipped with.
 */
export const eventCategory = defineType({
  name: "eventCategory",
  title: "Type d'événement",
  type: "document",
  groups: [
    { name: "text", title: "Textes", default: true },
    { name: "media", title: "Photos" },
    { name: "seo", title: "Google" },
  ],
  fields: [
    defineField({
      name: "key",
      title: "Type",
      type: "string",
      options: { list: categoryOptions },
      readOnly: true,
      group: "text",
    }),
    defineField({ name: "label", title: "Nom (menus et listes)", type: "localeString", group: "text" }),
    defineField({
      name: "singular",
      title: "Nom au singulier (formulaire de devis)",
      type: "localeString",
      group: "text",
    }),
    defineField({ name: "title", title: "Titre de la page", type: "localeString", group: "text" }),
    defineField({ name: "phrase", title: "Phrase courte (page d'accueil)", type: "localeString", group: "text" }),
    defineField({ name: "lead", title: "Chapeau (sous le titre)", type: "localeText", group: "text" }),
    defineField({ name: "introTitle", title: "Titre de l'introduction", type: "localeString", group: "text" }),
    defineField({ name: "intro", title: "Introduction", type: "localeParagraphs", group: "text" }),
    defineField({ name: "includes", title: "Ce qui est compris", type: "localeStringList", group: "text" }),
    defineField({ name: "occasions", title: "Occasions", type: "localeStringList", group: "text" }),
    defineField({
      name: "relatedServices",
      title: "Services associés",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: serviceOptions },
      group: "text",
    }),
    defineField({
      name: "image",
      title: "Photo principale",
      description: "En haut de la page et dans les listes.",
      type: "localizedImage",
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Galerie",
      type: "array",
      of: [defineArrayMember({ type: "localizedImage" })],
      options: { layout: "grid" },
      group: "media",
    }),
    defineField({ name: "seoTitle", title: "Titre Google", type: "localeString", group: "seo" }),
    defineField({ name: "seoDescription", title: "Description Google", type: "localeText", group: "seo" }),
    defineField({
      name: "serviceType",
      title: "Type de service (données structurées Google)",
      type: "localeString",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "label.fr", subtitle: "title.fr", media: "image" },
  },
});
