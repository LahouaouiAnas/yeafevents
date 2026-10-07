import type { Locale } from "@/i18n/config";

/**
 * GROQ queries, one per locale. Every translatable field is an object keyed by locale
 * ({ fr, en }), read as `field.fr`: GROQ has no attribute access through a parameter, so the
 * locale (a fixed union, never user input) is written into the query.
 * A document only exists in a language once it has a title and a slug in it.
 */

const image = (l: Locale) => `{
  asset,
  crop,
  hotspot,
  "alt": alt.${l},
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const translations = `"translations": {
  "fr": select(defined(title.fr) && defined(slug.fr.current) => slug.fr.current),
  "en": select(defined(title.en) && defined(slug.en.current) => slug.en.current)
}`;

const seo = (l: Locale) => `"seo": {
  "title": seo.title.${l},
  "description": seo.description.${l},
  "noindex": seo.noindex
}`;

const inLocale = (l: Locale) => `defined(title.${l}) && defined(slug.${l}.current)`;

export const projectsQuery = (l: Locale) => `
  *[_type == "project" && ${inLocale(l)} && defined(cover.asset)] | order(date desc) {
    "slug": slug.${l}.current,
    ${translations},
    "title": title.${l},
    "excerpt": coalesce(excerpt.${l}, ""),
    client,
    city,
    venue,
    eventType,
    date,
    guests,
    "services": coalesce(services, []),
    "cover": cover${image(l)},
    "gallery": coalesce(gallery[defined(asset)]${image(l)}, []),
    "body": coalesce(body.${l}, []),
    ${seo(l)}
  }
`;

export const postsQuery = (l: Locale) => `
  *[_type == "post" && ${inLocale(l)}] | order(publishedAt desc) {
    "slug": slug.${l}.current,
    ${translations},
    "title": title.${l},
    "excerpt": coalesce(excerpt.${l}, ""),
    "cover": select(defined(cover.asset) => cover${image(l)}),
    "body": coalesce(body.${l}, []),
    author,
    publishedAt,
    updatedAt,
    "categories": coalesce(categories, []),
    "faq": faq[defined(question.${l}) && defined(answer.${l})]{ "question": question.${l}, "answer": answer.${l} },
    relatedCategories,
    ${seo(l)}
  }
`;

export const testimonialsQuery = (l: Locale) => `
  *[_type == "testimonial" && defined(quote.${l})] | order(_createdAt desc) {
    "quote": quote.${l},
    author,
    "role": role.${l},
    eventType
  }
`;

/** The five event types; the key comes from the document (fixed ID `category.<key>`). */
export const categoriesQuery = (l: Locale) => `
  *[_type == "eventCategory"] {
    "key": coalesce(key, string::split(_id, ".")[1]),
    "label": label.${l},
    "singular": singular.${l},
    "title": title.${l},
    "phrase": phrase.${l},
    "lead": lead.${l},
    "introTitle": introTitle.${l},
    "intro": intro.${l},
    "includes": includes.${l},
    "occasions": occasions.${l},
    relatedServices,
    "image": select(defined(image.asset) => image${image(l)}),
    "gallery": gallery[defined(asset)]${image(l)},
    "seoTitle": seoTitle.${l},
    "seoDescription": seoDescription.${l},
    "serviceType": serviceType.${l}
  }
`;
