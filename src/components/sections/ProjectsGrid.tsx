import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/lib/content/types";
import { ProjectCard } from "./ProjectCard";

type ProjectsGridProps = {
  projects: Project[];
  locale: Locale;
  /** Rendered when no project is published yet (never fake entries). */
  empty: ReactNode;
  headingLevel?: "h2" | "h3";
};

export function ProjectsGrid({ projects, locale, empty, headingLevel }: ProjectsGridProps) {
  if (projects.length === 0) return <>{empty}</>;

  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="reveal">
          <ProjectCard project={project} locale={locale} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
