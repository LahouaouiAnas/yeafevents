import { resolveLocale } from "@/i18n/params";
import { MarrakechView, marrakechMetadata } from "@/views/marrakech";

const LOCALE = "en" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/event-agency-marrakech">) {
  return marrakechMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/event-agency-marrakech">) {
  return <MarrakechView locale={await resolveLocale(params, LOCALE)} />;
}
