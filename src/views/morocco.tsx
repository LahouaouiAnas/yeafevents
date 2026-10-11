import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndexList } from "@/components/sections/IndexList";
import { PageHero } from "@/components/sections/PageHero";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getImage } from "@/content/media";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories } from "@/lib/content";
import { categoryPath, routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function moroccoMetadata(locale: Locale) {
  return buildMetadata({
    locale,
    ...getDictionary(locale).morocco.seo,
    paths: routePaths("morocco"),
    image: getImage("congressHall", locale),
  });
}

export async function MoroccoView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.morocco;
  const categories = await getCategories(locale);
  const [marrakech, ...otherRegions] = t.regions.items;

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        image={getImage("congressHall", locale)}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.morocco, path: routePath("morocco", locale) })}
          />
        }
      />

      <StoryIntro title={t.intro.title} body={t.intro.body} />

      <section className="border-t border-ivory/10 py-20 sm:py-28">
        <Container>
          <SectionHeading title={t.regions.title} />
          <ul className="mt-14 grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
            {marrakech && (
              // Marrakech links to its dedicated page; other cities get one only once they have unique content.
              <li className="bg-coal sm:col-span-2 lg:col-span-1">
                <Link href={routePath("marrakech", locale)} className="group block h-full p-8 sm:p-10">
                  <h3 className="font-display text-3xl font-normal">{marrakech.name}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{marrakech.text}</p>
                  <span className="mt-8 inline-flex items-center gap-3 text-xs tracking-[0.18em] uppercase">
                    <span className="underline decoration-ivory/30 underline-offset-[10px] group-hover:decoration-champagne">
                      {dict.cta.marrakech}
                    </span>
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            )}
            {otherRegions.map((region) => (
              <li key={region.name} className="reveal bg-night p-8 sm:p-10">
                <h3 className="font-display text-3xl font-normal">{region.name}</h3>
                <p className="mt-3 leading-relaxed text-stone">{region.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-ivory/10 py-20 sm:py-28">
        <Container>
          <SectionHeading title={dict.footer.events} className="mb-12" />
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

      <CtaBanner
        title={t.cta.title}
        text={t.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
      />
    </>
  );
}
