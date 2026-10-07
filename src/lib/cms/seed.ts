import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { blogDrafts, type BlogDraft, type DraftBlock } from "@/content/blog-drafts";
import { getCategoryContent, getCategoryMedia } from "@/content/categories";
import { getImageSource, type ImageId } from "@/content/media";
import { locales, type Locale } from "@/i18n/config";
import { categoryKeys } from "@/lib/routes";
import { sanityConfig } from "./config";

type Client = ReturnType<typeof createClient>;

function writeClient(): Client | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !sanityConfig.projectId) return null;
  return createClient({ ...sanityConfig, token, useCdn: false });
}

/** Uploads shipped photos once per run; Sanity stores identical files only once anyway. */
function imageUploader(client: Client) {
  const uploads = new Map<ImageId, Promise<string | null>>();
  const upload = (id: ImageId) => {
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

  return async (id: ImageId, key?: string) => {
    const ref = await upload(id);
    if (!ref) return undefined;
    return {
      _type: "image",
      ...(key ? { _key: key } : {}),
      asset: { _type: "reference", _ref: ref },
      alt: { _type: "localeString", ...getImageSource(id).alt },
    };
  };
}

/** Everything the site imports into Sanity at server start (src/instrumentation.ts). */
export async function seedSanity(): Promise<void> {
  const client = writeClient();
  if (!client) return;
  const imageField = imageUploader(client);
  await seedEventCategories(client, imageField);
  await renameFrenchPrivateParty(client);
  await seedBlogDrafts(client, imageField);
}

/**
 * The French private-party label shipped in English ("Private Parties"). Fixes the imported
 * copy, only while it still holds that original value: a label edited in the Studio is kept.
 */
async function renameFrenchPrivateParty(client: Client): Promise<void> {
  const id = "category.privateParty";
  const current = await client.fetch<{ label?: string; singular?: string } | null>(
    `*[_id == $id][0]{ "label": label.fr, "singular": singular.fr }`,
    { id },
  );
  if (!current) return;
  const patch: Record<string, string> = {};
  if (current.label === "Private Parties") patch["label.fr"] = "Soirées privées";
  if (current.singular === "Private party") patch["singular.fr"] = "Soirée privée";
  if (Object.keys(patch).length === 0) return;
  await client.patch(id).set(patch).commit();
  console.log("[seed] French private-party label renamed to « Soirées privées »");
}

type ImageField = ReturnType<typeof imageUploader>;

/**
 * First import of the shipped event-type content, so the Studio opens on what is already
 * online. Only creates documents that do not exist yet: an edit made in the Studio is never
 * overwritten. Safe to run from several processes at once (createIfNotExists).
 */
async function seedEventCategories(client: Client, imageField: ImageField): Promise<void> {
  const ids = categoryKeys.map((key) => `category.${key}`);
  const existing = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }));
  const missing = categoryKeys.filter((key) => !existing.has(`category.${key}`));
  if (missing.length === 0) return;

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

/** Sanity Portable Text from the draft's compact blocks. */
function portableText(blocks: DraftBlock[], prefix: string) {
  return blocks.map(([kind, text], index) => ({
    _type: "block",
    _key: `${prefix}${index}`,
    style: kind === "h" ? "h2" : "normal",
    ...(kind === "li" ? { listItem: "bullet", level: 1 } : {}),
    markDefs: [],
    children: [{ _type: "span", _key: `${prefix}${index}s`, text, marks: [] }],
  }));
}

/**
 * The first blog articles, imported as DRAFTS: the agency reviews and publishes them in the
 * Studio. Each article is imported only once, ever: a record of imported IDs is kept in Sanity,
 * so an article deleted in the Studio does not come back at the next restart.
 */
async function seedBlogDrafts(client: Client, imageField: ImageField): Promise<void> {
  const stateId = "seed.state";
  const state = await client.fetch<{ importedPosts?: string[] } | null>(`*[_id == $id][0]{ importedPosts }`, { id: stateId });
  const imported = new Set(state?.importedPosts ?? []);
  const pending = blogDrafts.filter((draft) => !imported.has(draft.id));
  if (pending.length === 0) return;

  const localized = <T,>(type: string, read: (content: BlogDraft["content"][Locale]) => T, draft: BlogDraft) => ({
    _type: type,
    ...Object.fromEntries(locales.map((locale) => [locale, read(draft.content[locale])])),
  });

  for (const draft of pending) {
    const id = `post.${draft.id}`;
    await client.createIfNotExists({
      _id: `drafts.${id}`,
      _type: "post",
      title: localized("localeString", (c) => c.title, draft),
      slug: {
        _type: "localeSlug",
        ...Object.fromEntries(locales.map((locale) => [locale, { _type: "slug", current: draft.content[locale].slug }])),
      },
      excerpt: localized("localeText", (c) => c.excerpt, draft),
      cover: await imageField(draft.cover),
      body: {
        _type: "localeRichText",
        ...Object.fromEntries(locales.map((locale) => [locale, portableText(draft.content[locale].body, `${locale}b`)])),
      },
      author: "Yeaf Events",
      publishedAt: new Date().toISOString(),
      categories: [{ _key: "c0", ...localized("localeString", (c) => c.category, draft) }],
      faq: draft.content.fr.faq.map((_, index) => ({
        _type: "faqItem",
        _key: `faq${index}`,
        question: localized("localeString", (c) => c.faq[index]?.question ?? "", draft),
        answer: localized("localeText", (c) => c.faq[index]?.answer ?? "", draft),
      })),
      relatedCategories: draft.relatedCategories,
      seo: {
        _type: "seo",
        title: localized("localeString", (c) => c.seoTitle, draft),
        description: localized("localeText", (c) => c.seoDescription, draft),
        noindex: false,
      },
    });
    console.log(`[seed] blog draft "${draft.id}" imported into Sanity`);
  }

  await client
    .transaction()
    .createIfNotExists({ _id: stateId, _type: "seedState", importedPosts: [] })
    .patch(stateId, (patch) => patch.setIfMissing({ importedPosts: [] }).append("importedPosts", pending.map((draft) => draft.id)))
    .commit();
}
