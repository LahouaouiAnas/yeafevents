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
    { name: "pricing", title: "Formules & prix", default: true },
    { name: "text", title: "Textes" },
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
    // No longer shown on the site (pages were shortened); kept hidden so stored text is not flagged.
    defineField({ name: "includes", title: "Ce qui est compris", type: "localeStringList", group: "text", hidden: true }),
    defineField({ name: "occasions", title: "Occasions", type: "localeStringList", group: "text", hidden: true }),
    defineField({
      name: "relatedServices",
      title: "Services associés",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: serviceOptions },
      group: "text",
      hidden: true,
    }),
    defineField({
      name: "pricingTitle",
      title: "Titre de la section",
      description: "Ex. « Nos 3 formules de mariage tout compris ». La section n'apparaît que si au moins une formule est remplie.",
      type: "localeString",
      group: "pricing",
    }),
    defineField({
      name: "pricingNote",
      title: "Texte d'introduction",
      description: "Ex. « Prix de départ, hors vols et hébergement des invités. Chaque devis est ensuite ajusté. »",
      type: "localeText",
      group: "pricing",
    }),
    defineField({
      name: "formulas",
      title: "Formules",
      type: "array",
      group: "pricing",
      of: [
        defineArrayMember({
          type: "object",
          name: "formula",
          fields: [
            defineField({ name: "name", title: "Nom (ex. « Formule Signature »)", type: "localeString" }),
            defineField({
              name: "audience",
              title: "Pour qui (ex. « Pour 100 à 150 invités. Notre formule la plus demandée. »)",
              type: "localeText",
            }),
            defineField({ name: "priceEur", title: "Prix de départ en €", type: "number", validation: (rule) => rule.min(0) }),
            defineField({ name: "priceGbp", title: "Prix de départ en £", type: "number", validation: (rule) => rule.min(0) }),
            defineField({ name: "priceMad", title: "Prix de départ en MAD", type: "number", validation: (rule) => rule.min(0) }),
            defineField({
              name: "onRequest",
              title: "Prix sur demande",
              description: "Affiche « Sur devis » à la place du prix. Une formule sans prix et sans cette case reste cachée.",
              type: "boolean",
              initialValue: false,
            }),
            defineField({ name: "featured", title: "Mettre en avant (la plus demandée)", type: "boolean", initialValue: false }),
            defineField({
              name: "inclusions",
              title: "Ce qui est inclus",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "inclusion",
                  fields: [
                    defineField({ name: "label", title: "Poste (ex. « Lieu », « Traiteur »)", type: "localeString" }),
                    defineField({ name: "detail", title: "Précision (facultatif)", type: "localeText" }),
                  ],
                  preview: { select: { title: "label.fr", subtitle: "detail.fr" } },
                }),
              ],
            }),
            defineField({
              name: "extras",
              title: "Options et conditions (facultatif)",
              description: "Ex. « En option : photographe, orchestre live… ». Affiché sous « Ce qui est inclus ».",
              type: "localeText",
            }),
          ],
          preview: {
            select: { title: "name.fr", eur: "priceEur", gbp: "priceGbp", mad: "priceMad", onRequest: "onRequest" },
            prepare: ({ title, eur, gbp, mad, onRequest }) => ({
              title: title ?? "Formule",
              subtitle:
                [eur ? `dès ${eur} €` : null, gbp ? `dès ${gbp} £` : null, mad ? `${mad} MAD` : null].filter(Boolean).join(" · ") ||
                (onRequest ? "Sur devis" : "Cachée : ajoutez un prix ou cochez « Prix sur demande »"),
            }),
          },
        }),
      ],
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
