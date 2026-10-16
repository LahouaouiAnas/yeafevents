import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FormulaCards } from "@/components/sections/PricingFormulas";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getSiteSections } from "@/lib/content";
import { categoryPath, routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function pricingMetadata(locale: Locale) {
  return buildMetadata({ locale, ...getDictionary(locale).pricingPage.seo, paths: routePaths("pricing") });
}

/**
 * Every event type with its formulas, one after the other. Formulas, inclusions and whether
 * prices are shown are edited in the Studio (Types d'événement → Formules & prix); a type with no
 * formula to show gets a quote link instead.
 */
export async function PricingView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pricingPage;
  const [categories, show] = await Promise.all([getCategories(locale), getSiteSections()]);
  // Hidden in the Studio (Sections du site → Page Formules): the page does not exist.
  if (!show.packagesPage) notFound();
  const contactHref = `${routePath("contact", locale)}#composer`;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.pricing, path: routePath("pricing", locale) })}
          />
        }
      />

      {categories.map((category) => (
        <section
          key={category.key}
          id={category.key}
          aria-labelledby={`${category.key}-title`}
          className="scroll-mt-20 border-t border-ivory/10 py-16 sm:py-24"
        >
          <Container>
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-champagne">{category.label}</p>
                <h2 id={`${category.key}-title`} className="mt-4 font-display text-3xl font-normal sm:text-4xl">
                  {category.pricing?.title ?? category.title}
                </h2>
                {category.pricing?.note && <p className="mt-4 max-w-2xl text-ivory/75">{category.pricing.note}</p>}
              </div>
              <Link
                href={categoryPath(category.key, locale)}
                className="shrink-0 text-sm tracking-[0.18em] text-gold-soft uppercase underline decoration-champagne/40 underline-offset-[6px] hover:decoration-gold-soft"
              >
                {t.seeEvent} →
              </Link>
            </div>
            {category.pricing ? (
              <FormulaCards category={category.key} style={category.pricing.style} formulas={category.pricing.formulas} labels={dict.category.pricing} locale={locale} />
            ) : (
              <div className="flex flex-col gap-6 border border-ivory/12 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <p className="max-w-xl text-ivory/85">{t.onRequest}</p>
                <ButtonLink href={contactHref}>{dict.category.pricing.quote}</ButtonLink>
              </div>
            )}
          </Container>
        </section>
      ))}

      <CtaBanner title={dict.home.cta.title} text={dict.home.cta.text} primary={{ href: contactHref, label: dict.cta.plan }} />
    </>
  );
}
