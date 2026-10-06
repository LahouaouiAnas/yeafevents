import { getCategoryContent } from "@/content/categories";
import { getServiceContent } from "@/content/services";
import { getShowcaseContent } from "@/content/showcase";
import type { Locale } from "@/i18n/config";
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
 * Projects, posts and testimonials will come from Sanity; until then they are
 * intentionally empty rather than filled with invented content.
 */

export async function getCategories(locale: Locale): Promise<EventCategory[]> {
  return categoryKeys.map((key) => getCategoryContent(key, locale));
}

export async function getCategory(key: CategoryKey, locale: Locale): Promise<EventCategory> {
  return getCategoryContent(key, locale);
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<EventCategory | null> {
  const key = categoryKeyFromSlug(slug, locale);
  return key ? getCategoryContent(key, locale) : null;
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

export async function getProjects(_locale: Locale): Promise<Project[]> {
  return [];
}

export async function getProjectBySlug(slug: string, locale: Locale): Promise<Project | null> {
  const projects = await getProjects(locale);
  return projects.find((project) => project.slug === slug) ?? null;
}

/** Real events known only through their media (see ShowcaseItem). */
export async function getShowcase(locale: Locale): Promise<ShowcaseItem[]> {
  return getShowcaseContent(locale);
}

export async function getPosts(_locale: Locale): Promise<BlogPost[]> {
  return [];
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null> {
  const posts = await getPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getTestimonials(_locale: Locale, category?: CategoryKey): Promise<Testimonial[]> {
  const testimonials: Testimonial[] = [];
  return category ? testimonials.filter((item) => item.eventType === category) : testimonials;
}
