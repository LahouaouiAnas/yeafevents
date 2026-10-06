import { resolveLocale } from "@/i18n/params";
import { AboutView, aboutMetadata } from "@/views/about";

const LOCALE = "fr" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">) {
  return aboutMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/a-propos">) {
  return <AboutView locale={await resolveLocale(params, LOCALE)} />;
}
