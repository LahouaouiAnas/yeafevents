import { post } from "./post";
import { project } from "./project";
import { quoteRequest } from "./quoteRequest";
import { localeRichText, localeSlug, localeString, localeText, localizedImage, seo } from "./shared";
import { testimonial } from "./testimonial";

export const schemaTypes = [localeString, localeText, localeRichText, localeSlug, localizedImage, seo, project, post, testimonial, quoteRequest];
