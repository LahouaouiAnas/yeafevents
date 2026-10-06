import { resolveLocale } from "@/i18n/params";
import { ProjectsIndexView, projectsIndexMetadata } from "@/views/projects";

const LOCALE = "fr" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: LOCALE }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/realisations">) {
  return projectsIndexMetadata(await resolveLocale(params, LOCALE));
}

export default async function Page({ params }: PageProps<"/[lang]/realisations">) {
  return <ProjectsIndexView locale={await resolveLocale(params, LOCALE)} />;
}
