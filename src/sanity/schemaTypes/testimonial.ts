import { defineField, defineType } from "sanity";
import { categoryOptions } from "./shared";

export const testimonial = defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Témoignage", type: "localeText", validation: (rule) => rule.required() }),
    defineField({ name: "author", title: "Nom", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Rôle (ex. « Mariée », « DRH »)", type: "localeString" }),
    defineField({
      name: "eventType",
      title: "Type d'événement",
      description: "Le témoignage s'affiche aussi sur la page de ce type d'événement.",
      type: "string",
      options: { list: categoryOptions, layout: "radio" },
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "quote.fr" },
  },
});
