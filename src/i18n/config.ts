export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Open Graph locale codes. French content targets Morocco first. */
export const ogLocales: Record<Locale, string> = {
  fr: "fr_MA",
  en: "en_US",
};

export const localeLabels: Record<Locale, { short: string; long: string }> = {
  fr: { short: "FR", long: "Français" },
  en: { short: "EN", long: "English" },
};
