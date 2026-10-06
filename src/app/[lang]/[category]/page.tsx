import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/i18n/params";
import { getCategoryBySlug } from "@/lib/content";
import { categoryKeys, categorySlugs } from "@/lib/routes";
import { CategoryView, categoryMetadata } from "@/views/category";

/** Event categories at the locale root (/fr/mariages, /en/weddings…). Static sibling routes win. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => categoryKeys.map((key) => ({ lang, category: categorySlugs[key][lang] })));
}

async function loadCategory(params: PageProps<"/[lang]/[category]">["params"]) {
  const locale = await resolveLocale(params);
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug, locale);
  if (!category) notFound();
  return { category, locale };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[category]">) {
  const { category, locale } = await loadCategory(params);
  return categoryMetadata(category, locale);
}

export default async function Page({ params }: PageProps<"/[lang]/[category]">) {
  const { category, locale } = await loadCategory(params);
  return <CategoryView category={category} locale={locale} />;
}
