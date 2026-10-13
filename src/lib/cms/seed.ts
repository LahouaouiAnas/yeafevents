import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { blogDrafts, type BlogDraft, type DraftBlock } from "@/content/blog-drafts";
import { getCategoryContent, getCategoryMedia } from "@/content/categories";
import { getImageSource, type ImageId } from "@/content/media";
import { formerWeddingDraft, formerWeddingNote, pricingDrafts, type PricingDraft } from "@/content/pricing-drafts";
import { getShowcaseContent } from "@/content/showcase";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales, type Locale } from "@/i18n/config";
import { defaultSections } from "@/lib/content/sections";
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
  await seedFormulas(client);
  await applyWeddingGuide(client);
  await rewordWeddingNote(client);
  await splitGuestCounts(client);
  await seedSiteSettings(client);
  await seedHomePage(client, imageField);
  await upgradeHomeHero(client, imageField);
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

const localized = (type: string, value: Record<Locale, string>) => ({ _type: type, ...value });

/** Sanity fields of the "Formules & prix" tab, from a shipped draft. */
function pricingFields(draft: PricingDraft) {
  return {
    pricingTitle: localized("localeString", draft.title),
    pricingNote: localized("localeText", draft.note),
    formulas: draft.formulas.map((formula, index) => ({
      _type: "formula",
      _key: `formula${index}`,
      name: localized("localeString", formula.name),
      ...(formula.guestsMin ? { guestsMin: formula.guestsMin } : {}),
      ...(formula.guestsMax ? { guestsMax: formula.guestsMax } : {}),
      ...(formula.audience ? { audience: localized("localeText", formula.audience) } : {}),
      ...(formula.priceGbp ? { priceGbp: formula.priceGbp } : {}),
      featured: formula.featured ?? false,
      onRequest: false,
      inclusions: formula.inclusions.map((label, row) => ({
        _type: "inclusion",
        _key: `inc${index}-${row}`,
        label: localized("localeString", label),
      })),
      ...(formula.extras ? { extras: localized("localeText", formula.extras) } : {}),
    })),
  };
}

/**
 * Fills the "Formules & prix" tab of each event type once (pricing-drafts.ts). Only where the
 * tab was never touched (no `formulas` field at all), so Studio edits are never replaced.
 */
async function seedFormulas(client: Client): Promise<void> {
  const ids = await client.fetch<string[]>(`*[_type == "eventCategory" && !defined(formulas)]._id`);
  for (const id of ids) {
    const key = id.replace(/^category\./, "") as keyof typeof pricingDrafts;
    const draft = pricingDrafts[key];
    if (!draft) continue;
    await client.patch(id).setIfMissing(pricingFields(draft)).commit();
    console.log(`[seed] price formulas added to "${key}"`);
  }
}

/**
 * Replaces the first, price-less wedding formulas with the plans of the agency's wedding guide,
 * only while the tab still holds exactly those untouched formulas (no price, same names and
 * inclusions). Anything edited in the Studio is kept as is.
 */
async function applyWeddingGuide(client: Client): Promise<void> {
  const id = "category.wedding";
  const current = await client.fetch<{
    rev: string;
    formulas?: { name?: string; priced: boolean; inclusions?: (string | null)[] }[] | null;
  } | null>(
    `*[_id == $id][0]{ "rev": _rev, "formulas": formulas[]{ "name": name.fr, "priced": defined(priceEur) || defined(priceGbp) || defined(priceMad) || onRequest == true, "inclusions": inclusions[].label.fr } }`,
    { id },
  );
  const formulas = current?.formulas;
  if (!current || !formulas) return;
  const untouched =
    formulas.length === formerWeddingDraft.length &&
    formulas.every((formula, index) => {
      const [name, inclusions] = formerWeddingDraft[index]!;
      return !formula.priced && formula.name === name && JSON.stringify(formula.inclusions ?? []) === JSON.stringify(inclusions);
    });
  if (!untouched) return;
  // ifRevisionId: if the agency saves the tab meanwhile, this write is refused and their edit wins.
  await client
    .patch(id)
    .ifRevisionId(current.rev)
    .set(pricingFields(pricingDrafts.wedding))
    .commit()
    .then(() => console.log("[seed] wedding formulas replaced with the wedding guide plans"))
    .catch(() => console.log("[seed] wedding formulas edited meanwhile: kept as they are"));
}

/**
 * Prices are now hidden by default, so the wedding introduction no longer speaks of "starting
 * prices". Replaced only while it is still the text shipped with the guide.
 */
async function rewordWeddingNote(client: Client): Promise<void> {
  const id = "category.wedding";
  const note = await client.fetch<string | null>(`*[_id == $id][0].pricingNote.fr`, { id });
  if (note !== formerWeddingNote) return;
  await client.patch(id).set({ pricingNote: localized("localeText", pricingDrafts.wedding.note) }).commit();
  console.log("[seed] wedding pricing introduction reworded without prices");
}

/**
 * The guest count moved from the formula's short description ("60 à 80 invités · une journée
 * et une soirée") to its own number fields. Splits descriptions still written that way;
 * formulas that already have a guest count, or another wording, are left alone.
 */
async function splitGuestCounts(client: Client): Promise<void> {
  type Formula = { guestsMin?: number; guestsMax?: number; audience?: Partial<Record<Locale, string>> } & Record<string, unknown>;
  const docs = await client.fetch<{ _id: string; _rev: string; formulas: Formula[] }[]>(
    `*[_type == "eventCategory" && defined(formulas)]{ _id, _rev, formulas }`,
  );
  const frPattern = /^(\d+) à (\d+) invités · (.+)$/;
  const enPattern = /^\d+-\d+ guests · (.+)$/;
  const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("fr") + text.slice(1);

  for (const doc of docs) {
    let changed = false;
    const formulas = doc.formulas.map((formula) => {
      const fr = formula.audience?.fr?.match(frPattern);
      if (!fr || formula.guestsMin !== undefined || formula.guestsMax !== undefined) return formula;
      changed = true;
      const en = formula.audience?.en?.match(enPattern);
      return {
        ...formula,
        guestsMin: Number(fr[1]),
        guestsMax: Number(fr[2]),
        audience: { ...formula.audience, fr: capitalize(fr[3]!), ...(en ? { en: capitalize(en[1]!) } : {}) },
      };
    });
    if (!changed) continue;
    await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .set({ formulas })
      .commit()
      .then(() => console.log(`[seed] guest counts moved to their own fields in "${doc._id}"`))
      .catch(() => console.log(`[seed] "${doc._id}" edited meanwhile: guest counts left as they are`));
  }
}

/** "Sections du site" with every box at its default, so the Studio shows the real state. */
async function seedSiteSettings(client: Client): Promise<void> {
  const saved = await client.fetch<Record<string, unknown> | null>(`*[_id == "siteSettings"][0]`);
  if (!saved) {
    await client.createIfNotExists({ _id: "siteSettings", _type: "siteSettings", ...defaultSections });
    console.log("[seed] « Sections du site » created");
    return;
  }
  // Boxes added to the list later get their default, without touching the saved ones.
  const missing = Object.fromEntries(Object.entries(defaultSections).filter(([key]) => typeof saved[key] !== "boolean"));
  if (Object.keys(missing).length > 0) await client.patch("siteSettings").setIfMissing(missing).commit();
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

/**
 * First import of the home page (fixed ID `homePage`) with its shipped texts and photos.
 */
async function seedHomePage(client: Client, imageField: ImageField): Promise<void> {
  const exists = await client.fetch<string | null>(`*[_id == "homePage"][0]._id`);
  if (exists) return;

  const t = Object.fromEntries(locales.map((locale) => [locale, getDictionary(locale).home])) as Record<
    Locale,
    ReturnType<typeof getDictionary>["home"]
  >;
  const text = <T,>(type: string, read: (home: (typeof t)[Locale]) => T) => ({
    _type: type,
    ...Object.fromEntries(locales.map((locale) => [locale, read(t[locale])])),
  });
  const label = (locale: Locale, key: Parameters<typeof getCategoryContent>[0]) => getCategoryContent(key, locale).label;
  const dinner = (locale: Locale) =>
    getShowcaseContent(locale).find((item) => item.id === "diner-ciel-de-lumieres")?.label ?? label(locale, "wedding");
  const caption = (read: (locale: Locale) => string) => ({
    _type: "localeString",
    ...Object.fromEntries(locales.map((locale) => [locale, read(locale)])),
  });

  // Same photos and captions as the shipped "Quelques moments" mosaic.
  const moments: [ImageId, ReturnType<typeof caption>][] = [
    ["weddingPavilion", caption((l) => label(l, "wedding"))],
    ["poolsideDusk", caption(dinner)],
    ["djCourtyard", caption((l) => label(l, "festival"))],
    ["liveSinger", caption((l) => label(l, "privateParty"))],
    ["congressAudience", caption((l) => label(l, "seminar"))],
    ["poolNight", caption((l) => label(l, "wedding"))],
  ];

  await client.createIfNotExists({
    _id: "homePage",
    _type: "homePage",
    heroKicker: text("localeString", (h) => h.hero.kicker),
    heroTitle: text("localeString", (h) => h.hero.title),
    heroAccent: text("localeString", (h) => h.hero.accent),
    heroText: text("localeText", (h) => h.hero.text),
    heroPhoto: await imageField("poolNight"),
    introEyebrow: text("localeString", (h) => h.intro.eyebrow),
    introText: text("localeText", (h) => h.intro.text),
    introNote: text("localeText", (h) => h.intro.note),
    introPhoto: await imageField("lightCanopyTable"),
    worldsEyebrow: text("localeString", (h) => h.categories.eyebrow),
    worldsTitle: text("localeString", (h) => h.categories.title),
    momentsEyebrow: text("localeString", (h) => h.moments.eyebrow),
    momentsTitle: text("localeString", (h) => h.moments.title),
    moments: await Promise.all(
      moments.map(async ([id, momentCaption], index) => ({
        _type: "moment",
        _key: `moment${index}`,
        photo: await imageField(id),
        caption: momentCaption,
      })),
    ),
    whyEyebrow: text("localeString", (h) => h.why.eyebrow),
    whyTitle: text("localeString", (h) => h.why.title),
    whySteps: t.fr.why.steps.map((_, index) => ({
      _type: "step",
      _key: `step${index}`,
      title: text("localeString", (h) => h.why.steps[index]?.title ?? ""),
      text: text("localeText", (h) => h.why.steps[index]?.text ?? ""),
    })),
    whyPhoto: await imageField("congressStage"),
    ctaTitle: text("localeString", (h) => h.cta.title),
    ctaText: text("localeText", (h) => h.cta.text),
    ctaPhoto: await imageField("candlelitDinner"),
    seoTitle: text("localeString", (h) => h.seo.title),
    seoDescription: text("localeText", (h) => h.seo.description),
  });
  console.log("[seed] home page imported into Sanity");
}

/** Shipped one-line hero titles, before the title was split into a line and a gold accent. */
const formerHeroTitles: Record<Locale, string> = {
  fr: "Des moments élégants, intemporels et inoubliables.",
  en: "Elegant, timeless and unforgettable moments.",
};

/**
 * The home hero changed from a slideshow to a single arched photo with a two-line title.
 * Upgrades a home page imported before that: splits the title where it is still the shipped
 * one (an edited title is kept), fills the new fields only when missing, and drops the
 * slideshow fields. Runs once: nothing to do when `heroPlace` and `heroPhotos` are gone.
 */
async function upgradeHomeHero(client: Client, imageField: ImageField): Promise<void> {
  const home = await client.fetch<{
    heroTitle?: Partial<Record<Locale, string>>;
    heroAccent?: unknown;
    heroText?: unknown;
    heroPhoto?: unknown;
    legacy: boolean;
  } | null>(`*[_id == "homePage"][0]{ heroTitle, heroAccent, heroText, heroPhoto, "legacy": defined(heroPlace) || defined(heroPhotos) }`);
  if (!home?.legacy) return;

  // Whole objects are written (not `heroTitle.fr` paths), so missing parents are never an issue.
  const set: Record<string, unknown> = {};
  const title: Record<string, unknown> = { _type: "localeString", ...home.heroTitle };
  const accent: Record<string, unknown> = { _type: "localeString", ...(home.heroAccent as object | undefined) };
  let split = false;
  for (const locale of locales) {
    const hero = getDictionary(locale).home.hero;
    if (home.heroTitle?.[locale] === formerHeroTitles[locale]) {
      title[locale] = hero.title;
      accent[locale] = hero.accent;
      split = true;
    }
  }
  if (split) {
    set.heroTitle = title;
    set.heroAccent = accent;
  }
  if (!home.heroText) {
    set.heroText = { _type: "localeText", ...Object.fromEntries(locales.map((l) => [l, getDictionary(l).home.hero.text])) };
  }
  if (!home.heroPhoto) {
    const photo = await imageField("poolNight");
    if (photo) set.heroPhoto = photo;
  }
  await client.patch("homePage").set(set).unset(["heroPlace", "heroPhotos"]).commit();
  console.log("[seed] home hero upgraded to the arched layout");
}
