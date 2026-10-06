"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { getAlternatePath } from "@/lib/routes";

/** Inline SVG flags: emoji flags do not render on Windows. Decorative, the code next to them is the label. */
function Flag({ locale }: { locale: Locale }) {
  const className = "h-3 w-[1.125rem] shrink-0 rounded-[2px] ring-1 ring-ivory/20";

  if (locale === "fr") {
    return (
      <svg viewBox="0 0 3 2" aria-hidden="true" className={className}>
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#ffffff" />
        <rect x="2" width="1" height="2" fill="#ED2939" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 40" aria-hidden="true" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#ffffff" strokeWidth="8" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30 0v40M0 20h60" stroke="#ffffff" strokeWidth="12" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1 text-xs tracking-[0.16em]">
        {locales.map((target) => {
          const content = (
            <>
              <Flag locale={target} />
              <span>{localeLabels[target].short}</span>
            </>
          );
          return (
            <li key={target}>
              {target === locale ? (
                <span aria-current="true" className="flex items-center gap-2 px-2 py-2 text-ivory">
                  {content}
                </span>
              ) : (
                <Link
                  href={getAlternatePath(pathname, locale, target)}
                  hrefLang={target}
                  lang={target}
                  title={localeLabels[target].long}
                  className="flex items-center gap-2 px-2 py-2 text-ivory/55 opacity-70 transition-[color,opacity] duration-300 hover:text-ivory hover:opacity-100"
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
