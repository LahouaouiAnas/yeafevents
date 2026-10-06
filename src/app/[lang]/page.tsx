import { resolveLocale } from "@/i18n/params";
import { HomeView, homeMetadata } from "@/views/home";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  return homeMetadata(await resolveLocale(params));
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  return <HomeView locale={await resolveLocale(params)} />;
}
