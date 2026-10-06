import Link from "next/link";
import { Media } from "@/components/ui/Media";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/lib/content/types";
import { projectPath } from "@/lib/routes";

export function ProjectCard({ project, locale, headingLevel: Heading = "h3" }: { project: Project; locale: Locale; headingLevel?: "h2" | "h3" }) {
  return (
    <Link href={projectPath(project.slug, locale)} className="group block">
      <Media
        image={project.cover}
        aspect="aspect-[4/5]"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.015]"
      />
      <p className="mt-5 eyebrow text-stone">
        {project.city}
        {project.venue ? ` · ${project.venue}` : ""}
      </p>
      <Heading className="mt-3 font-display text-3xl font-light">{project.title}</Heading>
      <p className="mt-3 leading-relaxed text-stone">{project.excerpt}</p>
    </Link>
  );
}
