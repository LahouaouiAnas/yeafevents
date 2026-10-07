import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteForm } from "@/components/sections/QuoteForm";
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
      <section className="border-t border-ivory/10 py-16 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-[2fr_1fr] lg:gap-24">
          <div>
            <h2 className="mb-12 font-display text-4xl font-light">{t.form.title}</h2>
            <QuoteForm
              locale={locale}
              labels={t.form}
              eventTypes={categories.map((category) => ({ value: category.key, label: category.singular }))}
            />
          </div>
          {hasDirectContact && (
            <aside className="lg:border-l lg:border-ivory/10 lg:pl-12">
              <h2 className="eyebrow text-ivory/50">{t.direct}</h2>
              <ul className="mt-6 space-y-4 font-display text-2xl font-light">
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
                {socialLinks.map(([network, url]) => (
                  <li key={network}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-champagne">
                      {network}
                    </a>
                  </li>
                ))}
              </ul>
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
