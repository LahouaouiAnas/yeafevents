import { SocialLinks } from "@/components/layout/SocialLinks";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { EventComposer } from "@/components/sections/EventComposer";
import { Container } from "@/components/ui/Container";
import { siteConfig, socialLinks, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories } from "@/lib/content";
import { routePath, routePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export function contactMetadata(locale: Locale) {
  return buildMetadata({ locale, ...getDictionary(locale).contact.seo, paths: routePaths("contact") });
}

export async function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.contact;
  const categories = await getCategories(locale);
  const { email, phones, whatsapp } = siteConfig.contact;
  const hasDirectContact = Boolean(email || phones.length || whatsapp || socialLinks.length);

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.contact, path: routePath("contact", locale) })}
          />
        }
      />
      <section id="composer" className="scroll-mt-20 border-t border-ivory/10 py-16 sm:py-24">
        <Container className="grid gap-20">
          <div>
            <p className="eyebrow text-champagne">{t.composer.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl font-normal sm:text-5xl">{t.composer.title}</h2>
            <p className="mt-4 mb-14 max-w-xl text-stone">{t.composer.intro}</p>
            <EventComposer
              locale={locale}
              labels={t.form}
              composer={t.composer}
              whatsapp={whatsapp ?? ""}
              eventTypes={categories.map((category) => ({ value: category.key, label: category.singular, image: category.image }))}
            />
          </div>
          {hasDirectContact && (
            <aside className="grid gap-8 border-t border-ivory/10 pt-12 lg:grid-cols-[1fr_3fr] lg:items-start">
              <h2 className="eyebrow text-champagne">{t.direct}</h2>
              <div>
              <ul className="flex flex-wrap gap-x-10 gap-y-4 text-xl">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-champagne">
                      {email}
                    </a>
                  </li>
                )}
                {phones.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className="hover:text-champagne">
                      {phone}
                    </a>
                  </li>
                ))}
                {whatsapp && (
                  <li>
                    <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
                <SocialLinks className="mt-8" />
              </div>
            </aside>
          )}
        </Container>
      </section>
      <div className="border-t border-ivory/10">
        <FaqSection eyebrow={t.faq.eyebrow} title={t.faq.title} items={t.faq.items} />
      </div>
    </>
  );
}
