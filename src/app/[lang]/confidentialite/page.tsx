import { resolveLocale } from "@/i18n/params";
import { PrivacyView, privacyMetadata } from "@/views/privacy";

const LOCALE = "fr" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/confidentialite">) {
  return privacyMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/confidentialite">) {
  return <PrivacyView locale={await resolveLocale(params, LOCALE)} />;
}
