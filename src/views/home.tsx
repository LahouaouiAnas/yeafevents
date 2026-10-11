import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { ArchCards } from "@/components/sections/ArchCards";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ArchHero } from "@/components/sections/ArchHero";
import { MomentsMosaic } from "@/components/sections/MomentsMosaic";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { ArchFrame, Marquee, OrnamentDivider, Wave, ZelligePattern } from "@/components/ui/Ornaments";
import { siteConfig, whatsappHref } from "@/config/site";
import { getImage } from "@/content/media";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getCategory, getHomeContent, getShowcase } from "@/lib/content";
import { categoryPath, routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export async function homeMetadata(locale: Locale) {
  const { seo, cta } = await getHomeContent(locale);
  return buildMetadata({
    locale,
    ...seo,
    paths: routePaths("home"),
    absoluteTitle: true,
    image: cta.photo,
  });
}

/**
 * Deliberately short: who we are → pick an event type → a glimpse of real work →
 * why us → one call to action. Detailed content lives on the category pages.
 */
export async function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [home, categories, wedding, festival, showcase] = await Promise.all([
    getHomeContent(locale),
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
      <ArchHero
        title={home.hero.title}
        accent={home.hero.accent}
        subtitle={home.hero.kicker}
        text={home.hero.text}
        image={home.hero.photo}
        primary={{ href: contactHref, label: dict.cta.plan }}
        secondary={
          siteConfig.contact.whatsapp
            ? { href: whatsappHref(siteConfig.contact.whatsapp, dict.a11y.whatsappMessage), label: dict.a11y.whatsapp }
            : undefined
        }
      />

      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        <ZelligePattern fade="right" className="opacity-[0.09]" />
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <h2 className="eyebrow text-champagne lg:col-span-3 lg:pt-3">{home.intro.eyebrow}</h2>
          <div className="lg:col-span-5">
            <p className="font-display text-[1.75rem] leading-[1.3] font-normal text-balance sm:text-4xl sm:leading-[1.25]">
              {home.intro.text}
            </p>
            <p className="mt-6 text-stone">{home.intro.note}</p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <ButtonLink href={routePath("about", locale)} variant="text">
                {dict.cta.story}
              </ButtonLink>
              <ButtonLink href={routePath("marrakech", locale)} variant="text">
                {dict.cta.marrakech}
              </ButtonLink>
            </div>
          </div>
          <ArchFrame className="reveal mx-auto mt-6 w-full max-w-xs sm:max-w-sm lg:col-span-3 lg:col-start-10 lg:mt-0 lg:max-w-none">
            <Media
              image={home.intro.photo}
              aspect="aspect-[4/5] lg:aspect-[3/4]"
              sizes="(min-width: 1024px) 25vw, 384px"
              position="center 40%"
              className="h-full"
            />
          </ArchFrame>
        </Container>
      </section>

      <OrnamentDivider className="px-4" />

      <section id="univers" aria-labelledby="univers-title" className="scroll-mt-20 py-20 sm:py-28">
        <Container>
          <div className="mb-14 text-center sm:mb-20">
            <p className="eyebrow text-champagne">{home.worlds.eyebrow}</p>
            <h2 id="univers-title" className="mt-5 font-display text-4xl font-normal text-balance sm:text-5xl">
              {home.worlds.title}
            </h2>
            <Wave className="mx-auto mt-6" />
          </div>
          <ArchCards
            linkLabel={dict.cta.learnMore}
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

      <Marquee label={home.worlds.title} items={categories.map((category) => category.label)} />

      <section aria-labelledby="moments-title" className="py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-champagne">{home.moments.eyebrow}</p>
              <h2 id="moments-title" className="mt-5 font-display text-4xl font-normal sm:text-5xl">
                {home.moments.title}
              </h2>
            </div>
            <ButtonLink href={routePath("projects", locale)} variant="text">
              {dict.cta.allProjects}
            </ButtonLink>
          </div>
          <MomentsMosaic
            moments={(home.moments.items as Parameters<typeof MomentsMosaic>[0]["moments"] | undefined) ?? [
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

      <ApproachSteps eyebrow={home.why.eyebrow} title={home.why.title} steps={home.why.steps} image={home.why.photo} />

      <CtaBanner
        title={home.cta.title}
        text={home.cta.text}
        primary={{ href: contactHref, label: dict.cta.plan }}
        image={home.cta.photo}
      />
    </>
  );
}
