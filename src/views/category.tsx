import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { Testimonials } from "@/components/sections/Testimonials";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getService, getTestimonials } from "@/lib/content";
import type { EventCategory } from "@/lib/content/types";
import { categoryPath, categoryPaths, routePath, servicePath } from "@/lib/routes";
import { serviceSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function categoryMetadata(category: EventCategory, locale: Locale) {
  return buildMetadata({ locale, ...category.seo, paths: categoryPaths(category.key), image: category.image });
}

/**
 * Category page path: see the style (hero + gallery) → understand what we handle → how we
 * work → related expertise → plan the event.
 */
export async function CategoryView({ category, locale }: { category: EventCategory; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.category;
  const path = categoryPath(category.key, locale);
  const contactHref = routePath("contact", locale);
  const [allCategories, relatedServices, testimonials] = await Promise.all([
    getCategories(locale),
    Promise.all(category.relatedServices.map((key) => getService(key, locale))),
    getTestimonials(locale, category.key),
  ]);
  const otherCategories = allCategories.filter((item) => item.key !== category.key);

  return (
    <>
      <PageHero
        eyebrow={category.label}
        title={category.title}
        lead={category.lead}
        image={category.image}
        breadcrumbs={<Breadcrumbs label={dict.a11y.breadcrumb} items={breadcrumbTrail(locale, { name: category.label, path })} />}
      >
        <div className="mt-10">
          <ButtonLink href={contactHref}>{dict.cta.plan}</ButtonLink>
        </div>
      </PageHero>

      <StoryIntro title={category.introTitle} body={category.intro} />

      {(category.gallery.length > 0 || category.video) && (
        <section aria-labelledby="gallery-title" className="border-t border-ivory/10 py-20 sm:py-28">
          <Container>
            <h2 id="gallery-title" className="mb-10 font-display text-4xl font-light sm:mb-14 sm:text-5xl">
              {t.galleryTitle}
            </h2>
            <MediaGallery images={category.gallery} video={category.video} videoLabel={dict.a11y.playVideo} />
          </Container>
        </section>
      )}

      <section className="border-t border-ivory/10 py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl font-light sm:text-5xl">{t.includesTitle}</h2>
            <ul className="mt-10 border-t border-ivory/10">
              {category.includes.map((item) => (
                <li key={item} className="border-b border-ivory/10 py-4 font-display text-xl font-light sm:text-2xl">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="eyebrow text-ivory/50">{t.occasionsTitle}</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {category.occasions.map((occasion) => (
                <li key={occasion} className="border border-ivory/20 px-4 py-2 text-sm text-ivory/85">
                  {occasion}
                </li>
              ))}
            </ul>
            <h2 className="mt-14 eyebrow text-ivory/50">{t.localTitle}</h2>
            <p className="mt-5 leading-relaxed text-stone">{t.localText}</p>
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              <ButtonLink href={routePath("marrakech", locale)} variant="text">
                {dict.cta.marrakech}
              </ButtonLink>
              <ButtonLink href={routePath("morocco", locale)} variant="text">
                {dict.cta.morocco}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <ApproachSteps
        eyebrow={dict.approach.eyebrow}
        title={dict.approach.title}
        lead={dict.approach.lead}
        steps={dict.approach.steps}
      />

      <Testimonials eyebrow={category.label} title={t.testimonials} items={testimonials} />

      <RelatedLinks
        title={t.relatedServices}
        links={relatedServices.map((service) => ({
          href: servicePath(service.key, locale),
          title: service.title,
          text: service.tagline,
        }))}
      />
      <RelatedLinks
        title={t.otherCategories}
        links={otherCategories.map((item) => ({ href: categoryPath(item.key, locale), title: item.label, text: item.phrase }))}
      />

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: contactHref, label: dict.cta.plan }}
        secondary={{ href: routePath("projects", locale), label: dict.cta.allProjects }}
      />

      <JsonLd
        data={serviceSchema({
          name: category.title,
          description: category.seo.description,
          path,
          serviceType: category.serviceType,
          locale,
        })}
      />
    </>
  );
}
