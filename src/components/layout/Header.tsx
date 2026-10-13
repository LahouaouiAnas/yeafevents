import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getSiteSections } from "@/lib/content";
import { categoryPath, routePath } from "@/lib/routes";
import { HeaderBar, type NavItem } from "./HeaderBar";
import { Logo } from "./Logo";

export async function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [categories, show] = await Promise.all([getCategories(locale), getSiteSections()]);

  // Main navigation = home + the five event categories + packages (when shown). Everything else lives in the footer and CTAs.
  const items: NavItem[] = [
    { href: routePath("home", locale), label: dict.nav.home, exact: true },
    ...categories.map((category) => ({ href: categoryPath(category.key, locale), label: category.label })),
    ...(show.packagesPage ? [{ href: routePath("pricing", locale), label: dict.nav.pricing }] : []),
  ];

  const secondary: NavItem[] = [
    { href: routePath("about", locale), label: dict.nav.about },
    { href: routePath("projects", locale), label: dict.nav.projects },
    { href: routePath("contact", locale), label: dict.nav.contact },
  ];

  return (
    <HeaderBar
      locale={locale}
      items={items}
      secondary={secondary}
      homeHref={routePath("home", locale)}
      cta={{ href: routePath("contact", locale), label: dict.cta.plan }}
      labels={dict.a11y}
      logo={<Logo />}
    />
  );
}
