"use client";

/** Sanity Studio, served by the site at /studio (src/app/studio). */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityConfig } from "@/lib/cms/config";
import { schemaTypes } from "@/sanity/schemaTypes";

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
            S.documentTypeListItem("project").title("Réalisations"),
            S.documentTypeListItem("post").title("Articles de blog"),
            S.documentTypeListItem("testimonial").title("Témoignages"),
          ]),
    }),
  ],
});
