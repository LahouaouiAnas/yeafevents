import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { PageHero } from "@/components/sections/PageHero";
import { PricingFormulas } from "@/components/sections/PricingFormulas";
import { StoryIntro } from "@/components/sections/StoryIntro";
import { Testimonials } from "@/components/sections/Testimonials";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig, whatsappHref } from "@/config/site";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getTestimonials } from "@/lib/content";
import type { EventCategory } from "@/lib/content/types";
import { categoryPath, categoryPaths, routePath } from "@/lib/routes";
import { serviceSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function categoryMetadata(category: EventCategory, locale: Locale) {
  return buildMetadata({ locale, ...category.seo, paths: categoryPaths(category.key), image: category.image });
}

/**
 * Kept short on purpose: the promise (hero + intro) → the prices and what they include → real
 * photos → reviews, when there are some → plan the event.
 */
export async function CategoryView({ category, locale }: { category: EventCategory; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.category;
  const path = categoryPath(category.key, locale);
  const contactHref = `${routePath("contact", locale)}#composer`;
  const testimonials = await getTestimonials(locale, category.key);

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

      <StoryIntro title={category.introTitle} body={category.intro} />

      {category.pricing && (
        <PricingFormulas
          title={category.pricing.title}
          note={category.pricing.note}
          formulas={category.pricing.formulas}
          labels={t.pricing}
          locale={locale}
          quoteHref={contactHref}
        />
      )}

      {(category.gallery.length > 0 || category.video) && (
        <section aria-labelledby="gallery-title" className="border-t border-ivory/10 py-20 sm:py-28">
          <Container>
            <h2 id="gallery-title" className="mb-10 font-display text-4xl font-normal sm:mb-14 sm:text-5xl">
              {t.galleryTitle}
            </h2>
            <MediaGallery images={category.gallery} video={category.video} videoLabel={dict.a11y.playVideo} />
          </Container>
        </section>
      )}

      <Testimonials eyebrow={category.label} title={t.testimonials} items={testimonials} />

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: contactHref, label: dict.cta.plan }}
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
