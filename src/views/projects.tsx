import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { ShowcaseFeature } from "@/components/sections/ShowcaseFeature";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategory, getProjects, getService, getShowcase } from "@/lib/content";
import type { Project, ShowcaseItem } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { categoryPath, documentPaths, projectPath, routePath, routePaths, servicePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export async function projectsIndexMetadata(locale: Locale) {
  const [projects, showcase] = await Promise.all([getProjects(locale), getShowcase(locale)]);
  // An empty listing is thin content: keep it out of the index until real events are shown.
  return buildMetadata({
    locale,
    ...getDictionary(locale).projects.seo,
    paths: routePaths("projects"),
    image: showcase[0]?.cover,
    noindex: projects.length === 0 && showcase.length === 0,
  });
}

export async function ProjectsIndexView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.projects;
  const [projects, showcase] = await Promise.all([getProjects(locale), getShowcase(locale)]);
  const relatedFor = async (key: ShowcaseItem["category"]) => {
    if (!key) return undefined;
    const category = await getCategory(key, locale);
    return { href: categoryPath(key, locale), label: t.relatedCategory, title: category.label };
  };
  const related = await Promise.all(showcase.map((item) => relatedFor(item.category)));

  return (
    <>
      {/* Text-only hero: every photo belongs to one of the events below. */}
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.projects, path: routePath("projects", locale) })}
          />
        }
      />

      {showcase.map((item, index) => (
        <ShowcaseFeature key={item.id} item={item} index={index} related={related[index]} playLabel={dict.a11y.playVideo} />
      ))}

      {projects.length > 0 && (
        <section className="border-t border-ivory/10 py-20 sm:py-28">
          <Container>
            <ProjectsGrid projects={projects} locale={locale} headingLevel="h2" empty={null} />
          </Container>
        </section>
      )}

      {projects.length === 0 && showcase.length === 0 && (
        <Container className="py-28">
          <p className="max-w-xl text-lg leading-relaxed text-stone">{t.empty}</p>
        </Container>
      )}

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
      />
    </>
  );
}

export function projectMetadata(project: Project, locale: Locale) {
  return buildMetadata({
    locale,
    title: project.seo.title ?? project.title,
    description: project.seo.description ?? project.excerpt,
    paths: documentPaths(project.translations, projectPath),
    image: project.seo.image ?? project.cover,
    noindex: project.seo.noindex,
    canonical: project.seo.canonical,
  });
}

export async function ProjectView({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale);
  const labels = dict.projects.labels;
  const services = await Promise.all(project.services.map((key) => getService(key, locale)));
  const eventType = await getCategory(project.eventType, locale);

  const facts = [
    { label: labels.client, value: project.client },
    { label: labels.eventType, value: eventType.label },
    { label: labels.city, value: project.city },
    { label: labels.venue, value: project.venue },
    { label: labels.date, value: formatDate(project.date, locale) },
    { label: labels.guests, value: project.guests?.toString() },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <>
      <PageHero
        eyebrow={`${project.city}${project.venue ? ` · ${project.venue}` : ""}`}
        title={project.title}
        lead={project.excerpt}
        image={project.cover}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(
              locale,
              { name: dict.nav.projects, path: routePath("projects", locale) },
              { name: project.title, path: projectPath(project.slug, locale) },
            )}
          />
        }
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_2fr] lg:gap-24">
          <dl className="space-y-6 border-t border-ivory/10 pt-8">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow text-stone">{fact.label}</dt>
                <dd className="mt-2 font-display text-2xl font-light">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <RichText blocks={project.body} />
        </Container>
      </section>

      {project.video && (
        <section className="pb-24">
          <Container>
            <div className="mx-auto aspect-video max-w-5xl">
              <VideoPlayer video={project.video} label={`${dict.a11y.playVideo} — ${project.title}`} />
            </div>
          </Container>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Container>
            <h2 className="sr-only">{labels.gallery}</h2>
            <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {project.gallery.map((image) => (
                <li key={image.src}>
                  <Media image={image} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <RelatedLinks
        title={labels.services}
        links={[
          { href: categoryPath(project.eventType, locale), title: eventType.label },
          ...services.map((service) => ({ href: servicePath(service.key, locale), title: service.title })),
          { href: routePath("marrakech", locale), title: dict.cta.marrakech },
        ]}
      />

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
      />
    </>
  );
}
