import { defineField, defineType } from "sanity";
import { sectionDefinitions, sectionGroups, sectionKeys } from "@/lib/content/sections";

/**
 * "Sections du site": one checkbox per section that can be shown or hidden (fixed ID
 * `siteSettings`, created by the site). The list and defaults live in src/lib/content/sections.ts.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Sections du site",
  type: "document",
  groups: Object.entries(sectionGroups).map(([name, title], index) => ({ name, title, default: index === 0 })),
  fields: sectionKeys.map((key) => {
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
  preview: { prepare: () => ({ title: "Sections du site" }) },
});
