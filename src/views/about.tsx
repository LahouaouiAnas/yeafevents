import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Statement } from "@/components/sections/Statement";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getImage } from "@/content/media";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function aboutMetadata(locale: Locale) {
  return buildMetadata({
    locale,
    ...getDictionary(locale).about.seo,
    paths: routePaths("about"),
    image: getImage("stringLightsTable", locale),
  });
}

/** Texts come from the agency's own presentation documents (story, mission, approach, identity). */
export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        image={getImage("stringLightsTable", locale)}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.about, path: routePath("about", locale) })}
          />
        }
      />

      <StoryIntro title={t.story.title} body={t.story.body}>
        <ButtonLink href={routePath("marrakech", locale)} variant="text">
          {dict.cta.marrakech}
        </ButtonLink>
      </StoryIntro>

      <div className="border-t border-ivory/10">
        <Statement eyebrow={t.mission.eyebrow} text={t.mission.statement} />
      </div>

      <ApproachSteps
        eyebrow={dict.approach.eyebrow}
        title={dict.approach.title}
        lead={dict.approach.lead}
        steps={dict.approach.steps}
      />

      <Statement eyebrow={t.identity.title} text={t.identity.text} />

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
        secondary={{ href: routePath("projects", locale), label: dict.cta.allProjects }}
      />
    </>
  );
}
