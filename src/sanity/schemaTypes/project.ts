import { defineArrayMember, defineField, defineType } from "sanity";
import { categoryOptions, serviceOptions } from "./shared";

export const project = defineType({
  name: "project",
  title: "Réalisation",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "localeString", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Cliquez sur « Generate » pour chaque langue publiée.",
      type: "localeSlug",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", title: "Résumé", type: "localeText" }),
    defineField({
      name: "eventType",
      title: "Type d'événement",
      type: "string",
      options: { list: categoryOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", title: "Date de l'événement", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "city", title: "Ville", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "venue", title: "Lieu", type: "string" }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "guests", title: "Nombre d'invités", type: "number" }),
    defineField({
      name: "services",
      title: "Services fournis",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: serviceOptions },
    }),
    defineField({ name: "cover", title: "Photo principale", type: "localizedImage", validation: (rule) => rule.required() }),
    defineField({ name: "gallery", title: "Galerie", type: "array", of: [defineArrayMember({ type: "localizedImage" })] }),
    defineField({ name: "body", title: "Récit", type: "localeRichText" }),
    defineField({ name: "seo", title: "Référencement", type: "seo" }),
  ],
  orderings: [{ title: "Date (récent d'abord)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title.fr", subtitle: "city", media: "cover" },
  },
});
