"use client";

/** Sanity Studio, served by the site at /studio (src/app/studio). */
import { CalendarIcon } from "@sanity/icons/Calendar";
import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { DashboardIcon } from "@sanity/icons/Dashboard";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HomeIcon } from "@sanity/icons/Home";
import { ImagesIcon } from "@sanity/icons/Images";
import { InboxIcon } from "@sanity/icons/Inbox";
import { PackageIcon } from "@sanity/icons/Package";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityConfig } from "@/lib/cms/config";
import { fixedTypes, schemaTypes } from "@/sanity/schemaTypes";
import { categoryOptions } from "@/sanity/schemaTypes/shared";
import { Dashboard } from "@/sanity/studio/Dashboard";
import { StudioLogo } from "@/sanity/studio/StudioLogo";
import { studioTheme } from "@/sanity/studio/theme";

export default defineConfig({
  name: "yeaf-events",
  title: "Yeaf Events",
  icon: StudioLogo,
  basePath: "/studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  theme: studioTheme,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      title: "Contenu",
      icon: DocumentTextIcon,
      structure: (S) =>
        S.list()
          .title("Contenu du site")
          .items([
            S.documentTypeListItem("quoteRequest")
              .title("Demandes de devis")
              .icon(InboxIcon)
              .child(S.documentTypeList("quoteRequest").title("Demandes de devis").defaultOrdering([{ field: "receivedAt", direction: "desc" }])),
            S.divider(),
            S.listItem()
              .title("Réglages du site (sections, Meta Pixel)")
              .id("siteSettings")
              .icon(CogIcon)
              .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Réglages du site")),
            S.listItem()
              .title("Page d'accueil")
              .id("homePage")
              .icon(HomeIcon)
              .child(S.document().schemaType("homePage").documentId("homePage").title("Page d'accueil")),
            S.listItem()
              .title("Types d'événement et formules")
              .id("eventCategories")
              .icon(PackageIcon)
              .child(
                S.list()
                  .title("Types d'événement")
                  .items(
                    categoryOptions.map(({ title, value }) =>
                      S.listItem()
                        .title(title)
                        .id(value)
                        .icon(CalendarIcon)
                        .child(S.document().schemaType("eventCategory").documentId(`category.${value}`).title(title)),
                    ),
                  ),
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Réalisations").icon(ImagesIcon),
            S.documentTypeListItem("post").title("Articles de blog").icon(DocumentTextIcon),
            S.documentTypeListItem("testimonial").title("Témoignages").icon(CommentIcon),
          ]),
    }),
  ],
  // The dashboard comes first, so it is the Studio's home screen.
  tools: (previous) => [{ name: "dashboard", title: "Tableau de bord", icon: DashboardIcon, component: Dashboard }, ...previous],
  document: {
    // Fixed documents (event types, home page, settings) are created by the site and must not disappear.
    newDocumentOptions: (previous) => previous.filter((option) => !fixedTypes.has(option.templateId)),
    actions: (previous, context) =>
      fixedTypes.has(context.schemaType)
        ? previous.filter((action) => !["delete", "duplicate", "unpublish"].includes(action.action ?? ""))
        : previous,
  },
});
