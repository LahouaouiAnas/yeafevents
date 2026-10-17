import { defineField, defineType } from "sanity";
import { sectionDefinitions, sectionGroups, sectionKeys } from "@/lib/content/sections";

/**
 * "Sections du site": one checkbox per section that can be shown or hidden (fixed ID
 * `siteSettings`, created by the site; list and defaults in src/lib/content/sections.ts), plus
 * the Meta Pixel settings.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Réglages du site",
  type: "document",
  groups: [
    ...Object.entries(sectionGroups).map(([name, title], index) => ({ name, title, default: index === 0 })),
    { name: "tracking", title: "Publicité (Meta Pixel)" },
  ],
  fields: [
    ...sectionKeys.map((key) => {
      const section = sectionDefinitions[key];
      return defineField({
        name: key,
        title: section.title,
        description: "description" in section ? section.description : undefined,
        type: "boolean",
        initialValue: section.default,
        group: section.group,
      });
    }),
    defineField({
      name: "metaPixelEnabled",
      title: "Activer le Meta Pixel",
      description:
        "Coché (avec un ID ci-dessous) : un bandeau cookies s'affiche, et le Pixel n'est chargé que pour les visiteurs qui acceptent. Décoché : aucun bandeau, aucun suivi.",
      type: "boolean",
      initialValue: false,
      group: "tracking",
    }),
    defineField({
      name: "metaPixelId",
      title: "ID du pixel",
      description: "Meta Business Suite → Gestionnaire d'événements → votre source de données (site web) : le numéro de 15 à 16 chiffres.",
      type: "string",
      group: "tracking",
      validation: (rule) => rule.regex(/^\d{10,20}$/, { name: "numéro" }).error("Uniquement des chiffres (10 à 20)."),
    }),
  ],
  preview: { prepare: () => ({ title: "Réglages du site" }) },
});
