import { defineField, defineType } from "sanity";

/** Requests sent from the site's contact form. Created by the site; only the status is edited here. */
export const quoteRequest = defineType({
  name: "quoteRequest",
  title: "Demande de devis",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Suivi",
      type: "string",
      options: {
        list: [
          { title: "Nouvelle", value: "new" },
          { title: "En cours", value: "inProgress" },
          { title: "Devis envoyé", value: "quoted" },
          { title: "Confirmée", value: "won" },
          { title: "Sans suite", value: "lost" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "notes", title: "Notes internes", type: "text", rows: 4 }),
    defineField({ name: "receivedAt", title: "Reçue le", type: "datetime", readOnly: true }),
    defineField({ name: "name", title: "Nom", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Téléphone", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "eventType", title: "Type d'événement", type: "string", readOnly: true }),
    defineField({ name: "city", title: "Ville", type: "string", readOnly: true }),
    defineField({ name: "date", title: "Date envisagée", type: "date", readOnly: true }),
    defineField({ name: "guests", title: "Invités", type: "number", readOnly: true }),
    defineField({ name: "budget", title: "Budget", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "locale", title: "Langue du site", type: "string", readOnly: true }),
  ],
  orderings: [{ title: "Plus récentes", name: "receivedDesc", by: [{ field: "receivedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", eventType: "eventType", date: "date", status: "status" },
    prepare: ({ name, eventType, date, status }) => ({
      title: `${status === "new" ? "● " : ""}${name ?? "Sans nom"}`,
      subtitle: [eventType, date].filter(Boolean).join(" · "),
    }),
  },
});
