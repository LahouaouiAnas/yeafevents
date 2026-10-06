import { resolveLocale } from "@/i18n/params";
import { MoroccoView, moroccoMetadata } from "@/views/morocco";

const LOCALE = "en" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/event-agency-morocco">) {
  return moroccoMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/event-agency-morocco">) {
  return <MoroccoView locale={await resolveLocale(params, LOCALE)} />;
}
