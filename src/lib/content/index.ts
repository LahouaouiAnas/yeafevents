import { getCategoryContent } from "@/content/categories";
import { getServiceContent } from "@/content/services";
import { getImage } from "@/content/media";
import { getShowcaseContent } from "@/content/showcase";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import {
  mergeCategory,
  mergeHome,
  type HomeContent,
  type RawHome,
  toPost,
  toProject,
  toTestimonial,
  type RawCategory,
  type RawPost,
  type RawProject,
  type RawTestimonial,
} from "@/lib/cms/mappers";
import { categoriesQuery, homeQuery, postsQuery, projectsQuery, testimonialsQuery } from "@/lib/cms/queries";
import { sanityFetch } from "@/lib/cms/sanity";
import {
  categoryKeyFromSlug,
  categoryKeys,
  serviceKeyFromSlug,
  serviceKeys,
  type CategoryKey,
  type ServiceKey,
} from "@/lib/routes";
import type { BlogPost, EventCategory, Project, Service, ShowcaseItem, Testimonial } from "./types";

/**
 * Content access layer. Pages only talk to these functions.
 * Projects, posts and testimonials come from Sanity (empty when it is not configured,
 * rather than filled with invented content); the rest is local.
 */

/** Event types: shipped content (src/content/categories.ts) overlaid with what is edited in Sanity. */
export async function getCategories(locale: Locale): Promise<EventCategory[]> {
  const raw = await sanityFetch<RawCategory[]>(categoriesQuery(locale), {}, ["eventCategory"]);
  const edited = new Map((raw ?? []).map((category) => [category.key, category]));
  return categoryKeys.map((key) => mergeCategory(getCategoryContent(key, locale), edited.get(key)));
}

export async function getCategory(key: CategoryKey, locale: Locale): Promise<EventCategory> {
  const categories = await getCategories(locale);
  return categories.find((category) => category.key === key) ?? getCategoryContent(key, locale);
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<EventCategory | null> {
  const key = categoryKeyFromSlug(slug, locale);
  return key ? getCategory(key, locale) : null;
}

export async function getServices(locale: Locale): Promise<Service[]> {
  return serviceKeys.map((key) => getServiceContent(key, locale));
}

export async function getService(key: ServiceKey, locale: Locale): Promise<Service> {
  return getServiceContent(key, locale);
}

export async function getServiceBySlug(slug: string, locale: Locale): Promise<Service | null> {
  const key = serviceKeyFromSlug(slug, locale);
  return key ? getServiceContent(key, locale) : null;
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const raw = await sanityFetch<RawProject[]>(projectsQuery(locale), {}, ["project"]);
  return (raw ?? []).map(toProject).filter((project): project is Project => Boolean(project));
}

export async function getProjectBySlug(slug: string, locale: Locale): Promise<Project | null> {
  const projects = await getProjects(locale);
  return projects.find((project) => project.slug === slug) ?? null;
}

/** Real events known only through their media (see ShowcaseItem). */
export async function getShowcase(locale: Locale): Promise<ShowcaseItem[]> {
  return getShowcaseContent(locale);
}

export async function getPosts(locale: Locale): Promise<BlogPost[]> {
  const raw = await sanityFetch<RawPost[]>(postsQuery(locale), {}, ["post"]);
  return (raw ?? []).map((post) => toPost(post, locale));
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null> {
  const posts = await getPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getTestimonials(locale: Locale, category?: CategoryKey): Promise<Testimonial[]> {
  const raw = await sanityFetch<RawTestimonial[]>(testimonialsQuery(locale), {}, ["testimonial"]);
  const testimonials = (raw ?? []).map(toTestimonial);
  return category ? testimonials.filter((item) => item.eventType === category) : testimonials;
}

/** Home page texts and photos as shipped (dictionary + media registry). */
export function getDefaultHomeContent(locale: Locale): HomeContent {
  const t = getDictionary(locale).home;
  return {
    seo: t.seo,
    hero: { kicker: t.hero.kicker, title: t.hero.title, place: t.hero.place, photos: {} },
    intro: { eyebrow: t.intro.eyebrow, text: t.intro.text, note: t.intro.note, photo: getImage("lightCanopyTable", locale) },
    worlds: { eyebrow: t.categories.eyebrow, title: t.categories.title },
    moments: { eyebrow: t.moments.eyebrow, title: t.moments.title },
    why: { eyebrow: t.why.eyebrow, title: t.why.title, steps: t.why.steps, photo: getImage("congressStage", locale) },
    cta: { title: t.cta.title, text: t.cta.text, photo: getImage("candlelitDinner", locale) },
  };
}

/** Home page: shipped content overlaid with what is edited in Sanity. */
export async function getHomeContent(locale: Locale): Promise<HomeContent> {
  const raw = await sanityFetch<RawHome | null>(homeQuery(locale), {}, ["homePage"]);
  return mergeHome(getDefaultHomeContent(locale), raw);
}
