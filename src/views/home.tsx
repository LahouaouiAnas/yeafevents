import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { CategoryExplorer } from "@/components/sections/CategoryExplorer";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { HomeHero } from "@/components/sections/HomeHero";
import { MomentsMosaic } from "@/components/sections/MomentsMosaic";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { getHeroSlides } from "@/content/hero";
import { getImage } from "@/content/media";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getCategory, getShowcase } from "@/lib/content";
import { categoryPath, routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export function homeMetadata(locale: Locale) {
  const { seo } = getDictionary(locale).home;
  return buildMetadata({
    locale,
    ...seo,
    paths: routePaths("home"),
    absoluteTitle: true,
    image: getImage("candlelitDinner", locale),
  });
}

/**
 * Deliberately short: who we are → pick an event type → a glimpse of real work →
 * why us → one call to action. Detailed content lives on the category pages.
 */
export async function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.home;
  const [categories, wedding, festival, showcase] = await Promise.all([
    getCategories(locale),
    getCategory("wedding", locale),
    getCategory("festival", locale),
    getShowcase(locale),
  ]);
  const contactHref = routePath("contact", locale);
  const dinner = showcase.find((item) => item.id === "diner-ciel-de-lumieres");
  const labelOf = (key: string) => categories.find((category) => category.key === key)?.label ?? wedding.label;

  return (
    <>
      <HomeHero
        brand={t.hero.brand}
        kicker={t.hero.kicker}
        title={t.hero.title}
        place={t.hero.place}
        labels={t.hero.carousel}
        slides={getHeroSlides(locale).map((slide) => {
          const category = slide.category ? categories.find((item) => item.key === slide.category) : undefined;
          return category
            ? { ...slide, label: category.label, href: categoryPath(category.key, locale) }
            : { ...slide, label: t.hero.carousel.experience, href: routePath("about", locale) };
        })}
        primaryCta={{ href: contactHref, label: dict.cta.plan }}
        secondaryCta={{ href: "#univers", label: dict.cta.discover }}
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <h2 className="eyebrow text-ivory/50 lg:col-span-3 lg:pt-3">{t.intro.eyebrow}</h2>
          <div className="lg:col-span-5">
            <p className="font-display text-[1.75rem] leading-[1.3] font-light text-balance sm:text-4xl sm:leading-[1.25]">
              {t.intro.text}
            </p>
            <p className="mt-6 text-stone">{t.intro.note}</p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <ButtonLink href={routePath("about", locale)} variant="text">
                {dict.cta.story}
              </ButtonLink>
              <ButtonLink href={routePath("marrakech", locale)} variant="text">
                {dict.cta.marrakech}
              </ButtonLink>
            </div>
          </div>
          <Media
            image={getImage("lightCanopyTable", locale)}
            aspect="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[3/4]"
            sizes="(min-width: 1024px) 25vw, 100vw"
            position="center 40%"
            className="reveal lg:col-span-3 lg:col-start-10"
          />
        </Container>
      </section>

      <section id="univers" aria-labelledby="univers-title" className="scroll-mt-20 border-t border-ivory/10 py-20 sm:py-28">
        <Container>
          <p className="eyebrow text-ivory/50">{t.categories.eyebrow}</p>
          <h2 id="univers-title" className="mt-5 mb-12 font-display text-4xl font-light text-balance sm:mb-16 sm:text-5xl">
            {t.categories.title}
          </h2>
          <CategoryExplorer
            items={categories.map((category) => ({
              key: category.key,
              href: categoryPath(category.key, locale),
              label: category.label,
              phrase: category.phrase,
              image: category.image,
            }))}
          />
        </Container>
      </section>

      <section aria-labelledby="moments-title" className="border-t border-ivory/10 py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-ivory/50">{t.moments.eyebrow}</p>
              <h2 id="moments-title" className="mt-5 font-display text-4xl font-light sm:text-5xl">
                {t.moments.title}
              </h2>
            </div>
            <ButtonLink href={routePath("projects", locale)} variant="text">
              {dict.cta.allProjects}
            </ButtonLink>
          </div>
          <MomentsMosaic
            moments={[
              { image: getImage("weddingPavilion", locale), caption: wedding.label },
              { image: getImage("poolsideDusk", locale), caption: dinner?.label ?? wedding.label },
              { image: getImage("djCourtyard", locale), caption: festival.label },
              { image: getImage("liveSinger", locale), caption: labelOf("privateParty") },
              { image: getImage("congressAudience", locale), caption: labelOf("seminar") },
              { image: getImage("poolNight", locale), caption: wedding.label },
            ]}
          />
        </Container>
      </section>

      <ApproachSteps
        eyebrow={t.why.eyebrow}
        title={t.why.title}
        steps={t.why.steps}
        image={getImage("pavilionStage", locale)}
      />

      <CtaBanner
        title={t.cta.title}
        text={t.cta.text}
        primary={{ href: contactHref, label: dict.cta.plan }}
        image={getImage("candlelitDinner", locale)}
      />
    </>
  );
}
