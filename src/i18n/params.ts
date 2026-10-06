import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";

/**
 * Resolves the `[lang]` route param. Pass `only` for routes whose path segment
 * exists in a single language (e.g. `agence-evenementielle-marrakech` is French only).
 */
export async function resolveLocale(
  params: Promise<{ lang: string }>,
  only?: Locale,
): Promise<Locale> {
  const { lang } = await params;
  if (!hasLocale(lang) || (only && lang !== only)) notFound();
  return lang;
}
