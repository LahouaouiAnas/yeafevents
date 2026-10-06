import { notFound } from "next/navigation";
import { resolveLocale } from "@/i18n/params";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { ProjectView, projectMetadata } from "@/views/projects";

const LOCALE = "fr" as const;

export async function generateStaticParams() {
  const projects = await getProjects(LOCALE);
  return projects.map((project) => ({ lang: LOCALE, slug: project.slug }));
}

async function loadProject(params: PageProps<"/[lang]/realisations/[slug]">["params"]) {
  const locale = await resolveLocale(params, LOCALE);
  const { slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  if (!project) notFound();
  return { project, locale };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/realisations/[slug]">) {
  const { project, locale } = await loadProject(params);
  return projectMetadata(project, locale);
}

export default async function Page({ params }: PageProps<"/[lang]/realisations/[slug]">) {
  const { project, locale } = await loadProject(params);
  return <ProjectView project={project} locale={locale} />;
}
