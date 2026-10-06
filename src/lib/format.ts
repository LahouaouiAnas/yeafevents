import type { Locale } from "@/i18n/config";

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }),
};

export function formatDate(isoDate: string, locale: Locale): string {
  return dateFormatters[locale].format(new Date(isoDate));
}
