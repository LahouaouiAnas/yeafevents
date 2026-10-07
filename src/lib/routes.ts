import { locales, type Locale } from "@/i18n/config";

/**
 * Single source of truth for public URLs.
 * Every internal link, canonical, hreflang and sitemap entry is derived from here,
 * so a slug change happens in one place.
 */

export type LocalizedPaths = Partial<Record<Locale, string>>;

export const staticRoutes = {
  home: { fr: "", en: "" },
  marrakech: { fr: "/agence-evenementielle-marrakech", en: "/event-agency-marrakech" },
  morocco: { fr: "/agence-evenementielle-maroc", en: "/event-agency-morocco" },
  services: { fr: "/services", en: "/services" },
  projects: { fr: "/realisations", en: "/projects" },
  blog: { fr: "/blog", en: "/blog" },
  about: { fr: "/a-propos", en: "/about" },
  contact: { fr: "/contact", en: "/contact" },
} as const satisfies Record<string, Record<Locale, string>>;

export type StaticRouteKey = keyof typeof staticRoutes;

/**
 * The five event categories ("univers") are the main navigation. They live at the root of
 * each locale, e.g. /fr/mariages, /en/weddings.
 */
export const categorySlugs = {
  wedding: { fr: "mariages", en: "weddings" },
  privateParty: { fr: "soirees-privees", en: "private-parties" },
  birthday: { fr: "anniversaires", en: "birthdays" },
  festival: { fr: "festivals", en: "festivals" },
  seminar: { fr: "seminaires", en: "seminars" },
} as const satisfies Record<string, Record<Locale, string>>;

export type CategoryKey = keyof typeof categorySlugs;

export const categoryKeys = Object.keys(categorySlugs) as CategoryKey[];

/**
 * Cross-cutting expertise, under /services. The former wedding, private party and corporate
 * service pages became categories: their old URLs are permanently redirected in next.config.ts.
 */
export const serviceSlugs = {
  teamBuilding: { fr: "team-building", en: "team-building" },
  entertainment: { fr: "animation-artistique", en: "entertainment" },
  production: { fr: "production-evenementielle", en: "event-production" },
} as const satisfies Record<string, Record<Locale, string>>;

export type ServiceKey = keyof typeof serviceSlugs;

export const serviceKeys = Object.keys(serviceSlugs) as ServiceKey[];

function withLocale(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

export function routePath(key: StaticRouteKey, locale: Locale): string {
  return withLocale(locale, staticRoutes[key][locale]);
}

export function routePaths(key: StaticRouteKey): LocalizedPaths {
  return mapLocales((locale) => routePath(key, locale));
}

export function categoryPath(key: CategoryKey, locale: Locale): string {
  return withLocale(locale, `/${categorySlugs[key][locale]}`);
}

export function categoryPaths(key: CategoryKey): LocalizedPaths {
  return mapLocales((locale) => categoryPath(key, locale));
}

export function categoryKeyFromSlug(slug: string, locale: Locale): CategoryKey | undefined {
  return categoryKeys.find((key) => categorySlugs[key][locale] === slug);
}

export function servicePath(key: ServiceKey, locale: Locale): string {
  return `${routePath("services", locale)}/${serviceSlugs[key][locale]}`;
}

export function servicePaths(key: ServiceKey): LocalizedPaths {
  return mapLocales((locale) => servicePath(key, locale));
}

export function serviceKeyFromSlug(slug: string, locale: Locale): ServiceKey | undefined {
  return serviceKeys.find((key) => serviceSlugs[key][locale] === slug);
}

export function projectPath(slug: string, locale: Locale): string {
  return `${routePath("projects", locale)}/${slug}`;
}

export function blogPostPath(slug: string, locale: Locale): string {
  return `${routePath("blog", locale)}/${slug}`;
}

/** Builds localized paths for CMS documents whose translations may not all exist. */
export function documentPaths(
  slugs: Partial<Record<Locale, string>>,
  toPath: (slug: string, locale: Locale) => string,
): LocalizedPaths {
  const paths: LocalizedPaths = {};
  for (const locale of locales) {
    const slug = slugs[locale];
    if (slug) paths[locale] = toPath(slug, locale);
  }
  return paths;
}

function mapLocales(fn: (locale: Locale) => string): Record<Locale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, fn(locale)])) as Record<Locale, string>;
}

/**
 * Finds the equivalent URL in another language for the language switcher.
 * CMS documents (projects, posts) fall back to their section index because their
 * translated slug is not known client-side.
 */
export function getAlternatePath(pathname: string, from: Locale, to: Locale): string {
  const rest = pathname.replace(new RegExp(`^/${from}(?=/|$)`), "");

  for (const key of Object.keys(staticRoutes) as StaticRouteKey[]) {
    if (staticRoutes[key][from] === rest) return routePath(key, to);
  }

  const categoryKey = categoryKeyFromSlug(rest.slice(1), from);
  if (categoryKey) return categoryPath(categoryKey, to);

  const servicesBase = `${staticRoutes.services[from]}/`;
  if (rest.startsWith(servicesBase)) {
    const serviceKey = serviceKeyFromSlug(rest.slice(servicesBase.length), from);
    return serviceKey ? servicePath(serviceKey, to) : routePath("services", to);
  }

  for (const section of ["projects", "blog"] as const) {
    if (rest.startsWith(`${staticRoutes[section][from]}/`)) return routePath(section, to);
  }

  return routePath("home", to);
}
