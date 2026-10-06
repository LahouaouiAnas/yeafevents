import { resolveLocale } from "@/i18n/params";
import { ContactView, contactMetadata } from "@/views/contact";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  return contactMetadata(await resolveLocale(params));
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  return <ContactView locale={await resolveLocale(params)} />;
}
