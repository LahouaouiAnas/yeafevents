import type { Locale } from "@/i18n/config";
import type { BlogPost, ImageAsset, Project, RichTextBlock, SeoFields, Testimonial } from "@/lib/content/types";
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
