import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { PageHero } from "@/components/sections/PageHero";
import { PricingFormulas } from "@/components/sections/PricingFormulas";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { Testimonials } from "@/components/sections/Testimonials";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig, whatsappHref } from "@/config/site";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getService, getSiteSections, getTestimonials } from "@/lib/content";
import type { EventCategory } from "@/lib/content/types";
import { categoryPath, categoryPaths, routePath, servicePath } from "@/lib/routes";
import { serviceSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function categoryMetadata(category: EventCategory, locale: Locale) {
  return buildMetadata({ locale, ...category.seo, paths: categoryPaths(category.key), image: category.image });
}

/**
 * The promise (hero + intro) → the packages → real photos → (what we handle) → (how we work)
 * → reviews, when there are some → (related links) → plan the event. Every section after the
 * hero can be shown or hidden in the Studio (Sections du site); bracketed ones are hidden by default.
 */
export async function CategoryView({ category, locale }: { category: EventCategory; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.category;
  const path = categoryPath(category.key, locale);
  const contactHref = `${routePath("contact", locale)}#composer`;
  const [show, testimonials, allCategories, relatedServices] = await Promise.all([
    getSiteSections(),
    getTestimonials(locale, category.key),
    getCategories(locale),
    Promise.all(category.relatedServices.map((key) => getService(key, locale))),
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
        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href={contactHref}>{dict.cta.plan}</ButtonLink>
          {siteConfig.contact.whatsapp && (
            <a
              href={whatsappHref(siteConfig.contact.whatsapp, dict.a11y.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-b border-ivory/25 pb-1 font-medium text-ivory transition-colors hover:border-champagne hover:text-gold-soft"
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-[#25d366]" />
              {dict.a11y.whatsapp}
            </a>
          )}
        </div>
      </PageHero>

      {show.categoryIntro && <StoryIntro title={category.introTitle} body={category.intro} />}

      {show.categoryFormulas && category.pricing && (
        <PricingFormulas
          title={category.pricing.title}
          note={category.pricing.note}
          formulas={category.pricing.formulas}
          labels={t.pricing}
          locale={locale}
          quoteHref={contactHref}
        />
      )}

      {show.categoryGallery && (category.gallery.length > 0 || category.video) && (
        <section aria-labelledby="gallery-title" className="border-t border-ivory/10 py-20 sm:py-28">
          <Container>
            <h2 id="gallery-title" className="mb-10 font-display text-4xl font-normal sm:mb-14 sm:text-5xl">
              {t.galleryTitle}
            </h2>
            <MediaGallery images={category.gallery} video={category.video} videoLabel={dict.a11y.playVideo} />
          </Container>
        </section>
      )}

      {show.categoryIncludes && (
        <section className="border-t border-ivory/10 py-20 sm:py-28">
          <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h2 className="font-display text-4xl font-normal sm:text-5xl">{t.includesTitle}</h2>
              <ul className="mt-10 border-t border-ivory/10">
                {category.includes.map((item) => (
                  <li key={item} className="border-b border-ivory/10 py-4 font-display text-xl font-normal sm:text-2xl">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="eyebrow text-champagne">{t.occasionsTitle}</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {category.occasions.map((occasion) => (
                  <li key={occasion} className="border border-ivory/20 px-4 py-2 text-sm text-ivory/85">
                    {occasion}
                  </li>
                ))}
              </ul>
              <h2 className="mt-14 eyebrow text-champagne">{t.localTitle}</h2>
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
      )}

      {show.categoryApproach && (
        <ApproachSteps
          eyebrow={dict.approach.eyebrow}
          title={dict.approach.title}
          lead={dict.approach.lead}
          steps={dict.approach.steps}
        />
      )}

      {show.categoryTestimonials && <Testimonials eyebrow={category.label} title={t.testimonials} items={testimonials} />}

      {show.categoryRelated && (
        <>
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
        </>
      )}

      {show.categoryCta && (
        <CtaBanner title={dict.home.cta.title} text={dict.home.cta.text} primary={{ href: contactHref, label: dict.cta.plan }} />
      )}

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
