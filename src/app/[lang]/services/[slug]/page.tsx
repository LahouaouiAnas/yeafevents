import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/i18n/params";
import { getServiceBySlug } from "@/lib/content";
import { serviceKeys, serviceSlugs } from "@/lib/routes";
import { ServiceView, serviceMetadata } from "@/views/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => serviceKeys.map((key) => ({ lang, slug: serviceSlugs[key][lang] })));
}

async function loadService(params: PageProps<"/[lang]/services/[slug]">["params"]) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const service = await getServiceBySlug(slug, locale);
  if (!service) notFound();
  return { service, locale };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { service, locale } = await loadService(params);
  return serviceMetadata(service, locale);
}

export default async function Page({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { service, locale } = await loadService(params);
  return <ServiceView service={service} locale={locale} />;
}
