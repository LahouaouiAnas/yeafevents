import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndexList } from "@/components/sections/IndexList";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getServices } from "@/lib/content";
import type { Service } from "@/lib/content/types";
import { categoryPath, routePath, routePaths, servicePath, servicePaths } from "@/lib/routes";
import { serviceSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function servicesIndexMetadata(locale: Locale) {
  return buildMetadata({ locale, ...getDictionary(locale).servicesIndex.seo, paths: routePaths("services") });
}

/** Hub page (footer link): the five event categories, then the three cross-cutting expertises. */
export async function ServicesIndexView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.servicesIndex;
  const [categories, services] = await Promise.all([getCategories(locale), getServices(locale)]);

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.services, path: routePath("services", locale) })}
          />
        }
      />
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title={t.universesTitle} className="mb-10" />
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
      <section className="pb-20 sm:pb-28">
        <Container>
          <SectionHeading title={t.expertiseTitle} className="mb-10" />
          <IndexList
            items={services.map((service) => ({
              href: servicePath(service.key, locale),
              title: service.title,
              text: service.tagline,
              image: service.image,
            }))}
          />
        </Container>
      </section>
      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
      />
    </>
  );
}

export function serviceMetadata(service: Service, locale: Locale) {
  return buildMetadata({ locale, ...service.seo, paths: servicePaths(service.key), image: service.image });
}

export async function ServiceView({ service, locale }: { service: Service; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.serviceDetail;
  const categories = await getCategories(locale);
  const path = servicePath(service.key, locale);

  return (
    <>
      <PageHero
        eyebrow={service.label}
        title={service.title}
        lead={service.excerpt}
        image={service.image}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(
              locale,
              { name: dict.nav.services, path: routePath("services", locale) },
              { name: service.title, path },
            )}
          />
        }
      >
        <div className="mt-10">
          <ButtonLink href={routePath("contact", locale)}>{dict.cta.plan}</ButtonLink>
        </div>
      </PageHero>

      <StoryIntro title={service.tagline} body={service.intro} />

      <section className="border-t border-ivory/10 py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl font-light sm:text-5xl">{t.includesTitle}</h2>
            <ul className="mt-10 border-t border-ivory/10">
              {service.includes.map((item) => (
                <li key={item} className="border-b border-ivory/10 py-4 font-display text-xl font-light sm:text-2xl">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="eyebrow text-ivory/50">{t.occasionsTitle}</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {service.occasions.map((occasion) => (
                <li key={occasion} className="border border-ivory/20 px-4 py-2 text-sm text-ivory/85">
                  {occasion}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <RelatedLinks
        title={t.relatedCategories}
        links={categories.map((category) => ({
          href: categoryPath(category.key, locale),
          title: category.label,
          text: category.phrase,
        }))}
      />

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
      />

      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.seo.description,
          path,
          serviceType: service.serviceType,
          locale,
        })}
      />
    </>
  );
}
