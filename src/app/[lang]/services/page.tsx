import { resolveLocale } from "@/i18n/params";
import { ServicesIndexView, servicesIndexMetadata } from "@/views/services";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">) {
  return servicesIndexMetadata(await resolveLocale(params));
}

export default async function Page({ params }: PageProps<"/[lang]/services">) {
  return <ServicesIndexView locale={await resolveLocale(params)} />;
}
