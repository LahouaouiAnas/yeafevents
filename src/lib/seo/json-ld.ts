import { absoluteUrl, siteConfig, socialLinks } from "@/config/site";
import type { Locale } from "@/i18n/config";

/**
 * Schema.org builders. They only emit facts present in siteConfig / content:
 * no invented address, rating or review.
 */

type JsonLdObject = Record<string, unknown>;

const ORGANIZATION_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

const areaServed = [
  { "@type": "City", name: "Marrakech", containedInPlace: { "@type": "Country", name: "Morocco" } },
  { "@type": "Country", name: "Morocco" },
];

function compact<T extends JsonLdObject>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)),
  ) as T;
}

export function organizationSchema(description?: string): JsonLdObject {
  const { contact, address, geo } = siteConfig;
  const hasPhysicalLocation = Boolean(address);

  return compact({
    "@context": "https://schema.org",
    // LocalBusiness requires a real address; until one is set, stay an Organization.
    "@type": hasPhysicalLocation ? ["Organization", "LocalBusiness"] : "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description,
    url: absoluteUrl(),
    logo: siteConfig.logo ? absoluteUrl(siteConfig.logo) : undefined,
    image: siteConfig.logo ? absoluteUrl(siteConfig.logo) : undefined,
    email: contact.email,
    telephone: contact.phones[0],
    foundingDate: siteConfig.foundingYear?.toString(),
    address: address ? { "@type": "PostalAddress", ...address } : undefined,
    geo: geo ? { "@type": "GeoCoordinates", ...geo } : undefined,
    areaServed,
    sameAs: socialLinks.map(([, url]) => url),
  });
}

export function websiteSchema(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: absoluteUrl(),
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  locale: Locale;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: absoluteUrl(input.path),
    inLanguage: input.locale,
    provider: { "@id": ORGANIZATION_ID },
    areaServed,
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    inLanguage: input.locale,
    image: input.image,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: input.authorName ? { "@type": "Person", name: input.authorName } : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  });
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
