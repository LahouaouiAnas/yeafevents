"use client";

/** Sanity Studio, served by the site at /studio (src/app/studio). */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityConfig } from "@/lib/cms/config";
import { fixedTypes, schemaTypes } from "@/sanity/schemaTypes";
import { categoryOptions } from "@/sanity/schemaTypes/shared";

export default defineConfig({
  name: "yeaf-events",
  title: "Yeaf Events",
  basePath: "/studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenu")
          .items([
            S.documentTypeListItem("quoteRequest")
              .title("Demandes de devis")
              .child(S.documentTypeList("quoteRequest").title("Demandes de devis").defaultOrdering([{ field: "receivedAt", direction: "desc" }])),
            S.divider(),
            S.listItem()
              .title("Types d'événement")
              .id("eventCategories")
              .child(
                S.list()
                  .title("Types d'événement")
                  .items(
                    categoryOptions.map(({ title, value }) =>
                      S.listItem()
                        .title(title)
                        .id(value)
                        .child(S.document().schemaType("eventCategory").documentId(`category.${value}`).title(title)),
                    ),
                  ),
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Réalisations"),
            S.documentTypeListItem("post").title("Articles de blog"),
            S.documentTypeListItem("testimonial").title("Témoignages"),
          ]),
    }),
  ],
  document: {
    // Fixed documents (the five event types) are created by the site and must not disappear.
    newDocumentOptions: (previous) => previous.filter((option) => !fixedTypes.has(option.templateId)),
    actions: (previous, context) =>
      fixedTypes.has(context.schemaType)
        ? previous.filter((action) => !["delete", "duplicate", "unpublish"].includes(action.action ?? ""))
        : previous,
  },
});
