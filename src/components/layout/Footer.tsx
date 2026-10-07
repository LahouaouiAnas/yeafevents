import Link from "next/link";
import { siteConfig, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories } from "@/lib/content";
import { categoryPath, routePath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

const linkClass = "inline-block py-1 text-stone transition-colors duration-300 hover:text-ivory";

/** Carries every secondary destination the slim main menu leaves out. */
export async function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const categories = await getCategories(locale);
  const { email, phones, whatsapp } = siteConfig.contact;

  const agency = [
    { href: routePath("about", locale), label: dict.nav.about },
    { href: routePath("projects", locale), label: dict.nav.projects },
    { href: routePath("services", locale), label: dict.nav.services },
    { href: routePath("marrakech", locale), label: dict.cta.marrakech },
    { href: routePath("morocco", locale), label: dict.cta.morocco },
    { href: routePath("blog", locale), label: dict.nav.blog },
  ];

  return (
    <footer className="border-t border-ivory/10 bg-coal">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href={routePath("home", locale)} aria-label={dict.a11y.home} className="inline-block">
            <Logo size={75} />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-stone">{dict.footer.tagline}</p>
          <p className="mt-6 text-xs tracking-[0.16em] text-ivory/80 uppercase">{dict.footer.location}</p>
        </div>

        <nav aria-label={dict.footer.events}>
          <h2 className="eyebrow text-ivory/50">{dict.footer.events}</h2>
          <ul className="mt-5 space-y-1 text-sm">
            {categories.map((category) => (
              <li key={category.key}>
                <Link href={categoryPath(category.key, locale)} className={linkClass}>
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.agency}>
          <h2 className="eyebrow text-ivory/50">{dict.footer.agency}</h2>
          <ul className="mt-5 space-y-1 text-sm">
            {agency.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-ivory/50">{dict.footer.contact}</h2>
          <ul className="mt-5 space-y-1 text-sm">
            <li>
              <Link href={routePath("contact", locale)} className={linkClass}>
                {dict.nav.contact}
              </Link>
            </li>
            {email && (
              <li>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </li>
            )}
            {phones.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)} className={linkClass}>
                  {phone}
                </a>
              </li>
            ))}
            {whatsapp && (
              <li>
                <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
          <SocialLinks className="mt-5" />
          <Link
            href={routePath("contact", locale)}
            className="mt-6 inline-block border border-ivory/30 px-5 py-3 text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-night"
          >
            {dict.cta.plan}
          </Link>
        </div>
      </Container>

      <Container className="border-t border-ivory/10 py-7 text-xs text-stone/80">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
