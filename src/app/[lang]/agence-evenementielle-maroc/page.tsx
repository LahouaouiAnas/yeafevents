import { resolveLocale } from "@/i18n/params";
import { MoroccoView, moroccoMetadata } from "@/views/morocco";

const LOCALE = "fr" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/agence-evenementielle-maroc">) {
  return moroccoMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/agence-evenementielle-maroc">) {
  return <MoroccoView locale={await resolveLocale(params, LOCALE)} />;
}
