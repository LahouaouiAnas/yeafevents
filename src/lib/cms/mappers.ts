import type { Locale } from "@/i18n/config";
import type { BlogPost, EventCategory, ImageAsset, Project, RichTextBlock, SeoFields, Testimonial } from "@/lib/content/types";
import type { CategoryKey, ServiceKey } from "@/lib/routes";
import { categoryKeys, serviceKeys } from "@/lib/routes";
import { sanityImageUrl, type SanityImage } from "./sanity";

/** Maps query results onto the site's content model (src/lib/content/types.ts). */

type PortableTextBlock = {
  _type: string;
  style?: string;
  listItem?: string;
  children?: { text?: string }[];
};

type RawSeo = { title?: string | null; description?: string | null; noindex?: boolean | null };

export type RawProject = {
  slug: string;
  translations: Partial<Record<Locale, string | null>>;
  title: string;
  excerpt: string;
  client?: string | null;
  city?: string | null;
  venue?: string | null;
  eventType?: string | null;
  date?: string | null;
  guests?: number | null;
  services: string[];
  cover: SanityImage;
  gallery: SanityImage[];
  body: PortableTextBlock[];
  seo: RawSeo;
};

export type RawPost = {
  slug: string;
  translations: Partial<Record<Locale, string | null>>;
  title: string;
  excerpt: string;
  cover?: SanityImage | null;
  body: PortableTextBlock[];
  author?: string | null;
  publishedAt: string;
  updatedAt?: string | null;
  categories: Partial<Record<Locale, string | null>>[];
  faq?: { question: string; answer: string }[] | null;
  relatedCategories?: string[] | null;
  seo: RawSeo;
};

export type RawTestimonial = {
  quote: string;
  author: string;
  role?: string | null;
  eventType?: string | null;
};

const isCategory = (value: unknown): value is CategoryKey => categoryKeys.includes(value as CategoryKey);
const isService = (value: unknown): value is ServiceKey => serviceKeys.includes(value as ServiceKey);

function toImage(image: SanityImage | null | undefined, fallbackAlt: string): ImageAsset | undefined {
  if (!image) return undefined;
  const src = sanityImageUrl(image);
  if (!src || !image.width || !image.height) return undefined;
  return { src, width: image.width, height: image.height, alt: image.alt || fallbackAlt };
}

function toTranslations(raw: Partial<Record<Locale, string | null>>): Partial<Record<Locale, string>> {
  return Object.fromEntries(Object.entries(raw).filter(([, slug]) => Boolean(slug))) as Partial<Record<Locale, string>>;
}

/** Plain-text blocks: headings, paragraphs and consecutive bullet items grouped into one list. */
export function toRichText(blocks: PortableTextBlock[]): RichTextBlock[] {
  const result: RichTextBlock[] = [];
  for (const block of blocks) {
    if (block._type !== "block") continue;
    const text = (block.children ?? []).map((child) => child.text ?? "").join("").trim();
    if (!text) continue;
    if (block.listItem) {
      const last = result.at(-1);
      if (last?.type === "list") last.items.push(text);
      else result.push({ type: "list", items: [text] });
    } else if (block.style === "h2") {
      result.push({ type: "heading", text });
    } else {
      result.push({ type: "paragraph", text });
    }
  }
  return result;
}

function toSeo(raw: RawSeo, image?: ImageAsset): SeoFields {
  return {
    title: raw.title ?? undefined,
    description: raw.description ?? undefined,
    noindex: raw.noindex ?? undefined,
    image,
  };
}

export function toProject(raw: RawProject): Project | null {
  const cover = toImage(raw.cover, raw.title);
  if (!cover || !isCategory(raw.eventType) || !raw.city || !raw.date) return null;
  return {
    slug: raw.slug,
    translations: toTranslations(raw.translations),
    title: raw.title,
    excerpt: raw.excerpt,
    client: raw.client ?? undefined,
    city: raw.city,
    venue: raw.venue ?? undefined,
    eventType: raw.eventType,
    date: raw.date,
    guests: raw.guests ?? undefined,
    services: raw.services.filter(isService),
    cover,
    gallery: raw.gallery.map((image) => toImage(image, raw.title)).filter((image): image is ImageAsset => Boolean(image)),
    body: toRichText(raw.body),
    seo: toSeo(raw.seo, cover),
  };
}

export function toPost(raw: RawPost, locale: Locale): BlogPost {
  const cover = toImage(raw.cover, raw.title);
  return {
    slug: raw.slug,
    translations: toTranslations(raw.translations),
    title: raw.title,
    excerpt: raw.excerpt,
    cover,
    body: toRichText(raw.body),
    author: raw.author ?? undefined,
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt ?? undefined,
    categories: raw.categories
      .map((category) => category[locale])
      .filter((category): category is string => Boolean(category)),
    faq: raw.faq?.length ? raw.faq : undefined,
    relatedCategories: raw.relatedCategories?.filter(isCategory),
    seo: toSeo(raw.seo, cover),
  };
}

export function toTestimonial(raw: RawTestimonial): Testimonial {
  return {
    quote: raw.quote,
    author: raw.author,
    role: raw.role ?? undefined,
    eventType: isCategory(raw.eventType) ? raw.eventType : undefined,
  };
}

export type RawCategory = {
  key: string;
  label?: string | null;
  singular?: string | null;
  title?: string | null;
  phrase?: string | null;
  lead?: string | null;
  introTitle?: string | null;
  intro?: (string | null)[] | null;
  includes?: (string | null)[] | null;
  occasions?: (string | null)[] | null;
  relatedServices?: string[] | null;
  image?: SanityImage | null;
  gallery?: SanityImage[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  serviceType?: string | null;
};

/** Edited text wins; an empty field keeps the text the site shipped with, so a page never breaks. */
const pick = (value: string | null | undefined, fallback: string) => (value?.trim() ? value.trim() : fallback);
const pickList = (value: (string | null)[] | null | undefined, fallback: string[]) => {
  const items = (value ?? []).map((item) => item?.trim()).filter((item): item is string => Boolean(item));
  return items.length > 0 ? items : fallback;
};

export function mergeCategory(base: EventCategory, raw: RawCategory | undefined): EventCategory {
  if (!raw) return base;
  const label = pick(raw.label, base.label);
  const relatedServices = (raw.relatedServices ?? []).filter(isService);
  return {
    ...base,
    label,
    singular: pick(raw.singular, base.singular),
    title: pick(raw.title, base.title),
    phrase: pick(raw.phrase, base.phrase),
    lead: pick(raw.lead, base.lead),
    introTitle: pick(raw.introTitle, base.introTitle),
    intro: pickList(raw.intro, base.intro),
    includes: pickList(raw.includes, base.includes),
    occasions: pickList(raw.occasions, base.occasions),
    serviceType: pick(raw.serviceType, base.serviceType),
    relatedServices: relatedServices.length > 0 ? relatedServices : base.relatedServices,
    image: toImage(raw.image, label) ?? base.image,
    // A gallery emptied on purpose stays empty; a missing one keeps the shipped photos.
    gallery: raw.gallery
      ? raw.gallery.map((image) => toImage(image, label)).filter((image): image is ImageAsset => Boolean(image))
      : base.gallery,
    seo: { title: pick(raw.seoTitle, base.seo.title), description: pick(raw.seoDescription, base.seo.description) },
  };
}
