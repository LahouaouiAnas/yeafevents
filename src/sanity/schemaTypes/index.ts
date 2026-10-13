import { eventCategory } from "./eventCategory";
import { homePage } from "./homePage";
import { post } from "./post";
import { project } from "./project";
import { quoteRequest } from "./quoteRequest";
import { siteSettings } from "./siteSettings";
import {
  localeParagraphs,
  localeRichText,
  localeSlug,
  localeString,
  localeStringList,
  localeText,
  localizedImage,
  seo,
} from "./shared";
import { testimonial } from "./testimonial";

export const schemaTypes = [
  localeString,
  localeText,
  localeRichText,
  localeStringList,
  localeParagraphs,
  localeSlug,
  localizedImage,
  seo,
  siteSettings,
  homePage,
  eventCategory,
  project,
  post,
  testimonial,
  quoteRequest,
];

/** Types with a fixed set of documents created by the site: no "create" or "delete" in the Studio. */
export const fixedTypes = new Set(["eventCategory", "homePage", "siteSettings"]);
