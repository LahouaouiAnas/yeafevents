import { resolveLocale } from "@/i18n/params";
import { PricingView, pricingMetadata } from "@/views/pricing";

const LOCALE = "en" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/packages">) {
  return pricingMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/packages">) {
  return <PricingView locale={await resolveLocale(params, LOCALE)} />;
}
