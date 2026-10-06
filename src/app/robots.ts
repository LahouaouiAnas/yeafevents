import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Staging and local environments must never be indexed.
  if (!siteConfig.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // /about/ holds internal reference documents (public/about), never meant to be indexed.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/about/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
