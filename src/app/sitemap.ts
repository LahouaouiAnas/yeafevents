import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getPosts, getProjects, getShowcase, getSiteSections } from "@/lib/content";
import {
  blogPostPath,
  categoryKeys,
  categoryPaths,
  documentPaths,
  projectPath,
  routePaths,
  serviceKeys,
  servicePaths,
  type LocalizedPaths,
  type StaticRouteKey,
} from "@/lib/routes";

type Entry = MetadataRoute.Sitemap[number];

/** One <url> per language version, each listing all its hreflang alternates. */
function localizedEntries(paths: LocalizedPaths, options: Omit<Entry, "url" | "alternates"> = {}): Entry[] {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const path = paths[locale];
    if (path) languages[locale] = absoluteUrl(path);
  }
  const xDefault = paths[defaultLocale];
  if (xDefault) languages["x-default"] = absoluteUrl(xDefault);

  return locales
    .map((locale) => paths[locale])
    .filter((path): path is string => Boolean(path))
    .map((path) => ({ url: absoluteUrl(path), alternates: { languages }, ...options }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectsByLocale, postsByLocale, sections] = await Promise.all([
    Promise.all(locales.map((locale) => getProjects(locale))),
    Promise.all(locales.map((locale) => getPosts(locale))),
    getSiteSections(),
  ]);
  const showcase = await getShowcase(defaultLocale);
  const hasProjects = showcase.length > 0 || projectsByLocale.some((list) => list.length > 0);
  const hasPosts = postsByLocale.some((list) => list.length > 0);

  // Listing pages are excluded (and noindexed) while they are empty.
  const staticKeys: StaticRouteKey[] = ["home", "marrakech", "morocco", "services", "about", "contact", "privacy"];
  if (sections.packagesPage) staticKeys.push("pricing");
  if (hasProjects) staticKeys.push("projects");
  if (hasPosts) staticKeys.push("blog");

  const priorities: Partial<Record<StaticRouteKey, number>> = { home: 1, pricing: 0.9, marrakech: 0.9, morocco: 0.8, services: 0.6, privacy: 0.2 };

  const entries: Entry[] = [
    ...staticKeys.flatMap((key) => localizedEntries(routePaths(key), { priority: priorities[key] ?? 0.6 })),
    ...categoryKeys.flatMap((key) => localizedEntries(categoryPaths(key), { priority: 0.9 })),
    ...serviceKeys.flatMap((key) => localizedEntries(servicePaths(key), { priority: 0.6 })),
  ];

  // CMS documents: dedupe translations by grouping them on their translation set.
  const seen = new Set<string>();
  const addDocuments = <T extends { slug: string; translations: Partial<Record<Locale, string>>; seo: { noindex?: boolean } }>(
    lists: T[][],
    toPath: (slug: string, locale: Locale) => string,
    lastModified: (doc: T) => string | undefined,
  ) => {
    for (const doc of lists.flat()) {
      if (doc.seo.noindex) continue;
      const paths = documentPaths(doc.translations, toPath);
      const key = JSON.stringify(paths);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push(...localizedEntries(paths, { lastModified: lastModified(doc), priority: 0.7 }));
    }
  };

  addDocuments(projectsByLocale, projectPath, (project) => project.date);
  addDocuments(postsByLocale, blogPostPath, (post) => post.updatedAt ?? post.publishedAt);

  return entries;
}
