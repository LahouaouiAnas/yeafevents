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
    // Shown only when "Ce que nous prenons en charge" / "Savoir-faire associés" are ticked in Sections du site.
    defineField({ name: "includes", title: "Ce que nous prenons en charge", type: "localeStringList", group: "text" }),
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
      name: "hideFormulas",
      title: "Masquer la section formules sur cette page",
      description: "Coché : aucune formule de ce type d'événement n'apparaît sur le site (page de l'événement et page Formules).",
      type: "boolean",
      initialValue: false,
      group: "pricing",
    }),
    defineField({
      name: "pricingStyle",
      title: "Présentation",
      type: "string",
      options: {
        list: [
          { title: "Formules côte à côte, avec bouton « Choisir cette formule »", value: "packs" },
          { title: "Prestations (cartes courtes, sans bouton)", value: "services" },
        ],
        layout: "radio",
      },
      initialValue: "packs",
      group: "pricing",
    }),
    defineField({
      name: "showPrices",
      title: "Afficher les prix sur le site",
      description: "Décoché : les formules et ce qu'elles incluent sont affichés, sans aucun prix. Les prix saisis restent enregistrés ici.",
      type: "boolean",
      initialValue: false,
      group: "pricing",
    }),
    defineField({
      name: "pricingTitle",
      title: "Titre de la section",
      description: "Ex. « Nos 3 formules de mariage ». La section n'apparaît qu'avec au moins une formule qui a un prix ou la case « Afficher sans prix ».",
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
            defineField({
              name: "hidden",
              title: "Masquer cette formule",
              description: "Cochée : la formule reste enregistrée ici mais n'apparaît plus sur le site.",
              type: "boolean",
              initialValue: false,
            }),
            defineField({ name: "name", title: "Titre de la formule (ex. « Formule Signature »)", type: "localeString" }),
            defineField({
              name: "guestsMin",
              title: "Nombre d'invités : minimum",
              description: "Affiché « 60 à 80 invités ». Laissez vide si sans minimum.",
              type: "number",
              validation: (rule) => rule.min(1).integer(),
            }),
            defineField({
              name: "guestsMax",
              title: "Nombre d'invités : maximum",
              description: "Laissez vide si sans maximum (« Dès 150 invités »).",
              type: "number",
              validation: (rule) =>
                rule.integer().custom((max, context) => {
                  const min = (context.parent as { guestsMin?: number } | undefined)?.guestsMin;
                  return typeof max === "number" && typeof min === "number" && max < min ? "Le maximum doit être au moins égal au minimum." : true;
                }),
            }),
            defineField({
              name: "audience",
              title: "Description courte (ex. « Une journée et une soirée »)",
              type: "localeText",
            }),
            defineField({ name: "priceEur", title: "Prix de départ en €", type: "number", validation: (rule) => rule.min(0) }),
            defineField({ name: "priceGbp", title: "Prix de départ en £", type: "number", validation: (rule) => rule.min(0) }),
            defineField({ name: "priceMad", title: "Prix de départ en MAD", type: "number", validation: (rule) => rule.min(0) }),
            defineField({
              name: "onRequest",
              title: "Afficher sans prix (sur devis)",
              description: "Pour une formule sans prix : elle s'affiche quand même (avec « Sur devis » si les prix sont affichés). Une formule sans prix et sans cette case reste cachée.",
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
            select: { title: "name.fr", eur: "priceEur", gbp: "priceGbp", mad: "priceMad", onRequest: "onRequest", min: "guestsMin", max: "guestsMax", hidden: "hidden" },
            prepare: ({ title, eur, gbp, mad, onRequest, min, max, hidden }) => {
              const prices = [eur ? `dès ${eur} €` : null, gbp ? `dès ${gbp} £` : null, mad ? `${mad} MAD` : null].filter(Boolean).join(" · ");
              const guests = min || max ? `${min ?? "?"}–${max ?? "+"} invités` : null;
              const details = [guests, prices || (onRequest ? "Sans prix" : null)].filter(Boolean).join(" · ");
              return {
                title: `${hidden ? "🚫 " : ""}${title ?? "Formule"}`,
                subtitle: hidden
                  ? "Masquée sur le site"
                  : details || "Cachée : ajoutez un prix ou cochez « Afficher sans prix »",
              };
            },
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
