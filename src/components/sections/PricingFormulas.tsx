import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { GoldRule, StarBullet } from "@/components/ui/Ornaments";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PricingFormula } from "@/lib/content/types";

type Labels = Dictionary["category"]["pricing"];

const numberLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

type PriceField = "priceEur" | "priceGbp" | "priceMad";

/** Display order: the first price set is the main one, the others follow as "≈". */
const priceFields: PriceField[] = ["priceEur", "priceGbp", "priceMad"];

function formatPrice(field: PriceField, value: number, locale: Locale): string {
  const options = { maximumFractionDigits: 0 } as const;
  if (field === "priceMad") return `${new Intl.NumberFormat(numberLocale[locale], options).format(value)} MAD`;
  const currency = field === "priceEur" ? "EUR" : "GBP";
  return new Intl.NumberFormat(numberLocale[locale], { ...options, style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(value);
}

/** "dès 4 500 €" / "≈ 48 000 MAD" / "Sur devis" for one formula. */
function priceLines(formula: PricingFormula, labels: Labels, locale: Locale) {
  const [first, ...others] = priceFields.filter((field) => formula[field]);
  if (!first) return { main: labels.onRequest, from: false };
  const secondary = others.map((field) => `${labels.approx} ${formatPrice(field, formula[field]!, locale)}`).join(" · ");
  return { main: formatPrice(first, formula[first]!, locale), secondary: secondary || undefined, from: true };
}

/** Lowest displayed starting price of a list of formulas, e.g. for a card "dès 2 500 €". */
export function startingPrice(formulas: PricingFormula[] | undefined, labels: Labels, locale: Locale): string | undefined {
  // Compared in the first currency (€, then £, then MAD) that any formula uses.
  const list = formulas ?? [];
  const currency = priceFields.find((field) => list.some((formula) => formula[field]));
  if (!currency) return undefined;
  const cheapest = list.filter((formula) => formula[currency]).sort((a, b) => a[currency]! - b[currency]!)[0]!;
  return `${labels.from} ${formatPrice(currency, cheapest[currency]!, locale)}`;
}

/**
 * Formulas side by side: name, price, then everything included, visible at once. The
 * featured formula gets a gold frame. Edited in the Studio (Types d'événement → Formules & prix).
 */
export function FormulaCards({ formulas, labels, locale }: { formulas: PricingFormula[]; labels: Labels; locale: Locale }) {
  const columns = formulas.length >= 3 ? "lg:grid-cols-3" : formulas.length === 2 ? "md:grid-cols-2" : "max-w-xl";
  return (
    <ul className={`grid gap-6 ${columns}`}>
      {formulas.map((formula) => {
        const price = priceLines(formula, labels, locale);
        return (
          <li
            key={formula.name}
            className={`reveal relative flex flex-col border p-7 sm:p-8 ${
              formula.featured ? "border-champagne bg-champagne/[0.06]" : "border-ivory/12 bg-coal/40"
            }`}
          >
            {formula.featured && (
              <p className="absolute -top-3 left-7 bg-champagne px-3 py-1 text-[0.62rem] font-medium tracking-[0.2em] text-night uppercase">
                {labels.featured}
              </p>
            )}
            <h3 className="font-display text-2xl font-normal sm:text-[1.7rem]">{formula.name}</h3>
            {/* Prices in the text face: Bodoni's hairline digits (4, 1) read poorly at this size. */}
            <p className="mt-4 text-3xl font-light tracking-tight text-gold-soft tabular-nums sm:text-4xl">
              {price.from && <span className="mr-1.5 text-[0.55em] tracking-normal text-ivory/70">{labels.from}</span>}
              {price.main}
            </p>
            {price.secondary && <p className="mt-1 text-sm text-ivory/60">{price.secondary}</p>}
            {formula.audience && <p className="mt-4 text-ivory/80">{formula.audience}</p>}
            {formula.inclusions.length > 0 && (
              <>
                <p className="eyebrow mt-7 border-t border-ivory/10 pt-6 text-champagne">{labels.included}</p>
                <ul className="mt-4 space-y-3">
                  {formula.inclusions.map((row) => (
                    <li key={row.label} className="flex gap-3">
                      <StarBullet className="mt-[0.45rem] size-2.5 shrink-0" />
                      <span>
                        {row.label}
                        {row.detail && <span className="block text-sm text-stone">{row.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {formula.extras && <p className="mt-6 border-t border-ivory/10 pt-5 text-sm leading-relaxed text-stone">{formula.extras}</p>}
          </li>
        );
      })}
    </ul>
  );
}

type PricingFormulasProps = {
  title: string;
  note?: string;
  formulas: PricingFormula[];
  labels: Labels;
  locale: Locale;
  quoteHref: string;
};

/** Pricing section of an event-type page. */
export function PricingFormulas({ title, note, formulas, labels, locale, quoteHref }: PricingFormulasProps) {
  return (
    <section id="tarifs" aria-labelledby="pricing-title" className="scroll-mt-20 border-t border-ivory/10 py-20 sm:py-28">
      <Container>
        <h2 id="pricing-title" className="font-display text-4xl font-normal text-balance sm:text-5xl">
          {title}
        </h2>
        <GoldRule className="mt-6" />
        {note && <p className="mt-6 max-w-2xl text-ivory/80">{note}</p>}
        <div className="mt-14">
          <FormulaCards formulas={formulas} labels={labels} locale={locale} />
        </div>
        <div className="mt-12">
          <ButtonLink href={quoteHref}>{labels.quote}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
