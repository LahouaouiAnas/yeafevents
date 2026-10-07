import { defineArrayMember, defineField, defineType } from "sanity";
import { categoryOptions } from "./shared";

export const post = defineType({
  name: "post",
  title: "Article de blog",
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
    defineField({ name: "cover", title: "Photo principale", type: "localizedImage" }),
    defineField({ name: "body", title: "Contenu", type: "localeRichText" }),
    defineField({ name: "author", title: "Auteur", type: "string" }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "updatedAt", title: "Date de mise à jour", type: "datetime" }),
    defineField({
      name: "categories",
      title: "Catégories",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "faq",
      title: "Questions fréquentes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "localeString" }),
            defineField({ name: "answer", title: "Réponse", type: "localeText" }),
          ],
          preview: { select: { title: "question.fr" } },
        }),
      ],
    }),
    defineField({
      name: "relatedCategories",
      title: "Types d'événement liés",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: categoryOptions },
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo" }),
  ],
  orderings: [{ title: "Publication (récent d'abord)", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title.fr", subtitle: "publishedAt", media: "cover" },
  },
});
