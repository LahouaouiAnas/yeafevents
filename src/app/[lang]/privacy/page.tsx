import { resolveLocale } from "@/i18n/params";
import { PrivacyView, privacyMetadata } from "@/views/privacy";

const LOCALE = "en" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  return privacyMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  return <PrivacyView locale={await resolveLocale(params, LOCALE)} />;
}
