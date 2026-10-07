import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { getCategoryContent, getCategoryMedia } from "@/content/categories";
import { getImageSource, type ImageId } from "@/content/media";
import { locales, type Locale } from "@/i18n/config";
import { categoryKeys } from "@/lib/routes";
import { sanityConfig } from "./config";

/**
 * First import of the shipped event-type content into Sanity, so the Studio opens on what is
 * already online. Runs at server start (src/instrumentation.ts) and only creates documents
 * that do not exist yet: an edit made in the Studio is never overwritten. Safe to run from
 * several processes at once (createIfNotExists; Sanity stores identical files only once).
 */
export async function seedEventCategories(): Promise<void> {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !sanityConfig.projectId) return;
  const client = createClient({ ...sanityConfig, token, useCdn: false });

  const ids = categoryKeys.map((key) => `category.${key}`);
  const existing = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }));
  const missing = categoryKeys.filter((key) => !existing.has(`category.${key}`));
  if (missing.length === 0) return;

  const uploads = new Map<ImageId, Promise<string | null>>();
  const uploadImage = (id: ImageId) => {
    if (!uploads.has(id)) {
      const { path: publicPath } = getImageSource(id);
      const file = path.join(process.cwd(), "public", publicPath);
      uploads.set(
        id,
        readFile(file)
          .then((buffer) => client.assets.upload("image", buffer, { filename: path.basename(file) }))
          .then((asset) => asset._id)
          .catch((error) => {
            console.error(`[seed] photo ${publicPath} not imported`, error);
            return null;
          }),
      );
    }
    return uploads.get(id)!;
  };

  const imageField = async (id: ImageId, key?: string) => {
    const ref = await uploadImage(id);
    if (!ref) return undefined;
    return {
      _type: "image",
      ...(key ? { _key: key } : {}),
      asset: { _type: "reference", _ref: ref },
      alt: { _type: "localeString", ...getImageSource(id).alt },
    };
  };

  for (const key of missing) {
    const byLocale = Object.fromEntries(locales.map((locale) => [locale, getCategoryContent(key, locale)])) as Record<
      Locale,
      ReturnType<typeof getCategoryContent>
    >;
    const localized = <T,>(type: string, read: (category: ReturnType<typeof getCategoryContent>) => T) => ({
      _type: type,
      ...Object.fromEntries(locales.map((locale) => [locale, read(byLocale[locale])])),
    });
    const { image, gallery } = getCategoryMedia(key);
    const galleryFields = await Promise.all(gallery.map((id, index) => imageField(id, `photo${index}`)));

    await client.createIfNotExists({
      _id: `category.${key}`,
      _type: "eventCategory",
      key,
      label: localized("localeString", (c) => c.label),
      singular: localized("localeString", (c) => c.singular),
      title: localized("localeString", (c) => c.title),
      phrase: localized("localeString", (c) => c.phrase),
      lead: localized("localeText", (c) => c.lead),
      introTitle: localized("localeString", (c) => c.introTitle),
      intro: localized("localeParagraphs", (c) => c.intro),
      includes: localized("localeStringList", (c) => c.includes),
      occasions: localized("localeStringList", (c) => c.occasions),
      relatedServices: byLocale.fr.relatedServices,
      image: image ? await imageField(image) : undefined,
      gallery: galleryFields.filter(Boolean),
      seoTitle: localized("localeString", (c) => c.seo.title),
      seoDescription: localized("localeText", (c) => c.seo.description),
      serviceType: localized("localeString", (c) => c.serviceType),
    });
    console.log(`[seed] event type "${key}" imported into Sanity`);
  }
}
