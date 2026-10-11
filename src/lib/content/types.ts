import type { Locale } from "@/i18n/config";
import type { CategoryKey, ServiceKey } from "@/lib/routes";

/**
 * Content model shared by local data today and Sanity tomorrow.
 * Sanity queries should map their results onto these types so pages never change.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type VideoAsset = {
  src: string;
  type: string;
  /** Real photo of the same scene (never a frame of the video), if one exists. */
  poster?: ImageAsset;
};

export type Faq = { question: string; answer: string };

export type RichTextBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type SeoFields = {
  title?: string;
  description?: string;
  image?: ImageAsset;
  canonical?: string;
  noindex?: boolean;
};

/** A priced package ("formule") of an event category. */
export type PricingFormula = {
  name: string;
  audience?: string;
  /** Starting prices; at least one is set. */
  priceEur?: number;
  priceMad?: number;
  featured: boolean;
  inclusions: { label: string; detail: string }[];
};

/** One of the five event categories of the main navigation (weddings, private parties…). */
export type EventCategory = {
  key: CategoryKey;
  /** Label in menus and lists. */
  label: string;
  /** Singular form, e.g. for the quote form's event type ("Mariage", "Wedding"). */
  singular: string;
  /** Page H1. */
  title: string;
  /** One line used on the home page and in lists. */
  phrase: string;
  lead: string;
  introTitle: string;
  intro: string[];
  includes: string[];
  occasions: string[];
  serviceType: string;
  image?: ImageAsset;
  gallery: ImageAsset[];
  video?: VideoAsset;
  relatedServices: ServiceKey[];
  /** Set only once formulas are entered in Sanity: prices are never invented. */
  pricing?: { title: string; note?: string; formulas: PricingFormula[] };
  seo: { title: string; description: string };
};

/** Cross-cutting expertise (production, entertainment, team building). */
export type Service = {
  key: ServiceKey;
  title: string;
  /** Short label for navigation and cards. */
  label: string;
  tagline: string;
  excerpt: string;
  intro: string[];
  includes: string[];
  occasions: string[];
  serviceType: string;
  /** Undefined until a real photo of this service exists. */
  image?: ImageAsset;
  seo: { title: string; description: string };
};

export type Project = {
  slug: string;
  /** Slugs of the same project in each available language (for hreflang). */
  translations: Partial<Record<Locale, string>>;
  title: string;
  excerpt: string;
  client?: string;
  city: string;
  venue?: string;
  eventType: CategoryKey;
  date: string;
  guests?: number;
  services: ServiceKey[];
  cover: ImageAsset;
  gallery: ImageAsset[];
  video?: VideoAsset;
  body: RichTextBlock[];
  seo: SeoFields;
};

export type BlogPost = {
  slug: string;
  translations: Partial<Record<Locale, string>>;
  title: string;
  excerpt: string;
  cover?: ImageAsset;
  body: RichTextBlock[];
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  categories: string[];
  faq?: Faq[];
  relatedCategories?: CategoryKey[];
  seo: SeoFields;
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  eventType?: CategoryKey;
};

/**
 * A real event shown through its media only. Unlike `Project`, it carries no city, date or
 * client: those facts are unknown and must not be invented. Promote to a `Project` once documented.
 */
export type ShowcaseItem = {
  id: string;
  title: string;
  label: string;
  description: string;
  cover?: ImageAsset;
  gallery: ImageAsset[];
  video?: VideoAsset;
  category?: CategoryKey;
};
