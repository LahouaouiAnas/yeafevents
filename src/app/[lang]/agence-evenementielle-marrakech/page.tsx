import { resolveLocale } from "@/i18n/params";
import { MarrakechView, marrakechMetadata } from "@/views/marrakech";

const LOCALE = "fr" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/agence-evenementielle-marrakech">) {
  return marrakechMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/agence-evenementielle-marrakech">) {
  return <MarrakechView locale={await resolveLocale(params, LOCALE)} />;
}
