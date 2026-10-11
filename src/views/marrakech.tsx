import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqSection } from "@/components/sections/FaqSection";
import { IndexList } from "@/components/sections/IndexList";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getImage } from "@/content/media";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories } from "@/lib/content";
import { categoryPath, routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function marrakechMetadata(locale: Locale) {
  return buildMetadata({
    locale,
    ...getDictionary(locale).marrakech.seo,
    paths: routePaths("marrakech"),
    image: getImage("poolsideDusk", locale),
  });
}

export async function MarrakechView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.marrakech;
  const categories = await getCategories(locale);
  const contactHref = routePath("contact", locale);

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        image={getImage("poolsideDusk", locale)}
        imagePosition="center 60%"
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.marrakech, path: routePath("marrakech", locale) })}
          />
        }
      >
        <div className="mt-10">
          <ButtonLink href={contactHref}>{dict.cta.plan}</ButtonLink>
        </div>
      </PageHero>

      <StoryIntro title={t.intro.title} body={t.intro.body} />

      <section className="border-t border-ivory/10 py-20 sm:py-28">
        <Container>
          <SectionHeading title={t.eventTypes.title} className="mb-12" />
          <IndexList
            items={categories.map((category) => ({
              href: categoryPath(category.key, locale),
              title: category.label,
              text: category.phrase,
              image: category.image,
            }))}
          />
        </Container>
      </section>

      <section className="border-t border-ivory/10 py-20 sm:py-28">
        <Container>
          <SectionHeading title={t.venues.title} lead={t.venues.lead} />
          <ul className="mt-14 grid gap-px bg-ivory/10 sm:grid-cols-2">
            {t.venues.items.map((venue, index) => (
              <li key={venue.name} className="reveal bg-night p-8 sm:p-10">
                <span className="font-display text-lg text-ivory/40">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-display text-3xl font-normal">{venue.name}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-stone">{venue.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div className="border-t border-ivory/10">
        <FaqSection title={t.faq.title} items={t.faq.items} />
      </div>

      <RelatedLinks
        title={dict.cta.learnMore}
        links={[
          { href: routePath("projects", locale), title: dict.nav.projects },
          { href: routePath("morocco", locale), title: dict.cta.morocco },
          { href: routePath("about", locale), title: dict.nav.about },
        ]}
      />

      <CtaBanner title={t.cta.title} text={t.cta.text} primary={{ href: contactHref, label: dict.cta.plan }} />
    </>
  );
}
