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

export type SocialNetwork = "instagram" | "facebook" | "pinterest" | "linkedin" | "tiktok" | "youtube";

type SiteConfig = {
  name: string;
  legalName?: string;
  url: string;
  indexable: boolean;
  /** URL-encoded path under /public (square, min 112x112 for Google). */
  logo?: string;
  contact: {
    email?: string;
    /** International format, e.g. "+212 6 00 00 00 00". The first one is the main number. */
    phones: string[];
    /** Digits only with country code, e.g. "212600000000". */
    whatsapp?: string;
  };
  address?: PostalAddress;
  geo?: { latitude: number; longitude: number };
  /** Full profile URLs; shown in this order. */
  socials: Partial<Record<SocialNetwork, string>>;
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
  contact: {
    email: "contact@yeafevents.com",
    phones: ["+212 6 60 52 66 81", "+212 6 60 52 66 04"],
    whatsapp: "212660526681",
  },
  socials: {
    instagram: "",
    facebook: "",
    pinterest: "",
  },
};

export const socialLinks = Object.entries(siteConfig.socials).filter(
  (entry): entry is [SocialNetwork, string] => Boolean(entry[1]),
);

/** `tel:` link for a number written in international format. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** WhatsApp chat link, optionally with a pre-filled message. */
export function whatsappHref(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path}`;
}
