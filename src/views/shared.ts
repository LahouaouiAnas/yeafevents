import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routePath } from "@/lib/routes";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";

/** Breadcrumb trail always starting at the localized home page. */
export function breadcrumbTrail(locale: Locale, ...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ name: getDictionary(locale).nav.home, path: routePath("home", locale) }, ...items];
}
