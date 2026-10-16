import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function privacyMetadata(locale: Locale) {
  return buildMetadata({ locale, ...getDictionary(locale).privacyPage.seo, paths: routePaths("privacy") });
}

/** Personal data and cookies: quote requests, the Meta Pixel (with consent) and visitors' rights. */
export function PrivacyView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.privacyPage;
  const email = siteConfig.contact.email;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.footer.privacy, path: routePath("privacy", locale) })}
          />
        }
      />
      <section className="border-t border-ivory/10 py-16 sm:py-24">
        <Container size="narrow" className="space-y-12">
          {t.sections.map((section) => {
            const [before, after] = section.text.split("{email}");
            return (
              <div key={section.title}>
                <h2 className="font-display text-2xl font-normal sm:text-3xl">{section.title}</h2>
                <p className="mt-4 leading-relaxed text-ivory/85">
                  {before}
                  {after !== undefined && (
                    <>
                      <a href={`mailto:${email}`} className="text-gold-soft underline decoration-champagne/40 underline-offset-4">
                        {email}
                      </a>
                      {after}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}
