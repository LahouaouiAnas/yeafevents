import { logoMarkPath } from "@/content/media";

/**
 * Business information used by the UI and structured data.
 * Only fill in verified facts: empty values are simply omitted from JSON-LD.
 */

export type PostalAddress = {
  streetAddress: string;
  addressLocality: string;
  postalCode?: string;
  addressRegion?: string;
  addressCountry: string;
};

type SiteConfig = {
  name: string;
  legalName?: string;
  url: string;
  indexable: boolean;
  /** URL-encoded path under /public (square, min 112x112 for Google). */
  logo?: string;
  contact: {
    email?: string;
    /** International format, e.g. "+212 6 00 00 00 00". */
    phone?: string;
    /** Digits only with country code, e.g. "212600000000". */
    whatsapp?: string;
  };
  address?: PostalAddress;
  geo?: { latitude: number; longitude: number };
  socials: Partial<Record<"instagram" | "facebook" | "linkedin" | "tiktok" | "youtube", string>>;
  foundingYear?: number;
};

function readSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export const siteConfig: SiteConfig = {
  name: "Yeaf Events",
  url: readSiteUrl(),
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  logo: logoMarkPath,
  contact: {},
  socials: {},
};

export const socialLinks = Object.entries(siteConfig.socials).filter(
  (entry): entry is [keyof SiteConfig["socials"], string] => Boolean(entry[1]),
);

export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path}`;
}
