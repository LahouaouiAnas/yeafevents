"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type NavItem = { href: string; label: string; exact?: boolean };

type HeaderBarProps = {
  locale: Locale;
  items: NavItem[];
  /** Secondary destinations, shown in the mobile menu only (the desktop footer carries them). */
  secondary: NavItem[];
  homeHref: string;
  cta: NavItem;
  labels: Dictionary["a11y"];
  /** Server-rendered logo (next/image). */
  logo: ReactNode;
};

export function HeaderBar({ locale, items, secondary, homeHref, cta, labels, logo }: HeaderBarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const toggle = toggleRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;
  const closeMenu = () => setMenuOpen(false);
  const isCurrent = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-ivory transition-[background-color,border-color] duration-500 ${
        solid ? "border-b border-ivory/10 bg-night/85 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-night/60 to-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ivory focus:px-4 focus:py-2 focus:text-night"
      >
        {labels.skipToContent}
      </a>

      <div className="mx-auto flex h-18 max-w-[90rem] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
        <Link href={homeHref} aria-label={labels.home} onClick={closeMenu} className="shrink-0">
          {logo}
        </Link>

        <nav aria-label={labels.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-6 text-[0.7rem] tracking-[0.14em] whitespace-nowrap uppercase 2xl:gap-8">
            {items.map((item) => {
              const current = isCurrent(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`relative py-2 transition-colors duration-300 hover:text-ivory after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ivory/70 after:transition-transform after:duration-500 ${
                      current ? "text-ivory after:scale-x-100" : "text-ivory/60 after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Always in the bar (next to the menu button on phones), never inside the menu. */}
          <LanguageSwitcher locale={locale} label={labels.languageSwitcher} />
          <Link
            href={cta.href}
            className="hidden border border-ivory/30 px-5 py-3 text-[0.7rem] tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-night md:inline-block"
          >
            {cta.label}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 flex items-center gap-3 p-2 text-[0.7rem] tracking-[0.16em] uppercase xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="hidden sm:inline">
              {labels.menu}
            </span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile & tablet menu: big touch targets, primary links first, CTA anchored at the bottom. */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-night sm:h-[calc(100dvh-5rem)] xl:hidden"
      >
        <nav aria-label={labels.mainNav} className="mx-auto flex min-h-full max-w-xl flex-col px-5 pt-6 pb-8 sm:px-8">
          <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
            {items.map((item, index) => {
              const current = isCurrent(item);
              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-baseline justify-between gap-4 py-4 font-display text-3xl font-light ${current ? "text-ivory" : "text-ivory/75"}`}
                  >
                    {item.label}
                    <span aria-hidden="true" className={`text-sm ${current ? "text-champagne" : "text-ivory/30"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-[0.16em] text-stone uppercase">
            {secondary.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMenu} className="inline-block py-2 hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <Link
              href={cta.href}
              onClick={closeMenu}
              className="block bg-ivory px-6 py-4 text-center text-xs font-medium tracking-[0.16em] text-night uppercase"
            >
              {cta.label}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
