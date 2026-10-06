import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { defaultLocale, locales, ogLocales, type Locale } from "@/i18n/config";
import type { ImageAsset } from "@/lib/content/types";
import type { LocalizedPaths } from "@/lib/routes";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  /** Localized pathnames of this page. Only languages that exist get an hreflang. */
  paths: LocalizedPaths;
  image?: ImageAsset;
  noindex?: boolean;
  /** Skips the "| Yeaf Events" title template (home page). */
  absoluteTitle?: boolean;
  /** Overrides the self-referencing canonical (rare, e.g. syndicated article). */
  canonical?: string;
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[] };
};

/** Builds complete per-page metadata: canonical, hreflang, Open Graph, Twitter, robots. */
export function buildMetadata({
  locale,
  title,
  description,
  paths,
  image,
  noindex = false,
  absoluteTitle = false,
  canonical,
  article,
}: PageMetadataInput): Metadata {
  const currentPath = paths[locale];
  if (!currentPath) throw new Error(`buildMetadata: missing path for locale "${locale}"`);

  const languages: Record<string, string> = {};
  for (const lang of locales) {
    const path = paths[lang];
    if (path) languages[lang] = path;
  }
  const xDefault = paths[defaultLocale] ?? currentPath;
  languages["x-default"] = xDefault;

  const images = image
    ? [{ url: image.src, alt: image.alt, width: image.width, height: image.height }]
    : [{ url: `/og/${locale}`, width: 1200, height: 630, alt: siteConfig.name }];
  const alternateLocale = locales.filter((lang) => lang !== locale && paths[lang]).map((lang) => ogLocales[lang]);
  const indexable = siteConfig.indexable && !noindex;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonical ?? currentPath,
      languages,
    },
    openGraph: {
      title,
      description,
      url: currentPath,
      siteName: siteConfig.name,
      locale: ogLocales[locale],
      alternateLocale,
      images,
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, modifiedTime: article.modifiedTime, authors: article.authors }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: true },
  };
}
