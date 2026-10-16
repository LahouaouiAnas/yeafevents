import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { GoldRule, StarBullet } from "@/components/ui/Ornaments";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PricingFormula } from "@/lib/content/types";
import { routePath, type CategoryKey } from "@/lib/routes";

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
  if (!first) return formula.onRequest ? { main: labels.onRequest, from: false } : undefined;
  const secondary = others.map((field) => `${labels.approx} ${formatPrice(field, formula[field]!, locale)}`).join(" · ");
  return { main: formatPrice(first, formula[first]!, locale), secondary: secondary || undefined, from: true };
}

/** "60 à 80 invités" / "Dès 150 invités" / "Jusqu'à 30 invités". */
function guestsLine({ guestsMin: min, guestsMax: max }: PricingFormula, labels: Labels, locale: Locale): string | undefined {
  const format = (value: number) => new Intl.NumberFormat(numberLocale[locale]).format(value);
  const fill = (template: string) => template.replace("{min}", format(min ?? 0)).replace("{max}", format(max ?? 0));
  if (min && max) return fill(labels.guestsRange);
  if (min) return fill(labels.guestsFrom);
  if (max) return fill(labels.guestsUpTo);
  return undefined;
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
/** The quote form with this event type and package already chosen (read by EventComposer). */
function chooseHref(category: CategoryKey, formula: PricingFormula, locale: Locale): string {
  const query = new URLSearchParams({ type: category, pack: formula.name });
  return `${routePath("contact", locale)}?${query}#composer`;
}

export function FormulaCards({
  category,
  style = "packs",
  formulas,
  labels,
  locale,
}: {
  category: CategoryKey;
  style?: "packs" | "services";
  formulas: PricingFormula[];
  labels: Labels;
  locale: Locale;
}) {
  if (style === "services") return <ServiceCards formulas={formulas} labels={labels} locale={locale} />;
  const columns = formulas.length >= 3 ? "lg:grid-cols-3" : formulas.length === 2 ? "md:grid-cols-2" : "max-w-xl";
  return (
    <ul className={`grid gap-6 ${columns}`}>
      {formulas.map((formula) => {
        const price = priceLines(formula, labels, locale);
        const guests = guestsLine(formula, labels, locale);
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
            {price && (
              <p className="mt-4 text-3xl font-light tracking-tight text-gold-soft tabular-nums sm:text-4xl">
                {price.from && <span className="mr-1.5 text-[0.55em] tracking-normal text-ivory/70">{labels.from}</span>}
                {price.main}
              </p>
            )}
            {price?.secondary && <p className="mt-1 text-sm text-ivory/60">{price.secondary}</p>}
            {guests && <p className="mt-4 text-lg text-ivory">{guests}</p>}
            {formula.audience && <p className={guests ? "mt-1 text-ivory/70" : "mt-4 text-ivory/80"}>{formula.audience}</p>}
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
            {/* Pushed to the bottom so the buttons line up across cards of different lengths. */}
            <div className="mt-auto pt-8">
              <ButtonLink
                href={chooseHref(category, formula, locale)}
                variant={formula.featured ? "solid" : "outline"}
                className="w-full"
                aria-label={`${labels.choose} : ${formula.name}`}
              >
                {labels.choose}
              </ButtonLink>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** What the agency delivers (festivals, seminars): short cards, no price, no "Choose" button. */
function ServiceCards({ formulas, labels, locale }: { formulas: PricingFormula[]; labels: Labels; locale: Locale }) {
  return (
    <ul className="grid gap-px overflow-hidden border border-ivory/12 bg-ivory/12 sm:grid-cols-2 lg:grid-cols-3">
      {formulas.map((formula) => {
        const guests = guestsLine(formula, labels, locale);
        return (
          <li key={formula.name} className="reveal flex flex-col bg-night p-7 sm:p-8">
            <StarBullet className="size-3" />
            <h3 className="mt-5 font-display text-xl font-normal sm:text-2xl">{formula.name}</h3>
            {guests && <p className="mt-2 text-ivory">{guests}</p>}
            {formula.audience && <p className="mt-3 leading-relaxed text-ivory/75">{formula.audience}</p>}
            {formula.inclusions.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-ivory/80">
                {formula.inclusions.map((row) => (
                  <li key={row.label}>— {row.label}</li>
                ))}
              </ul>
            )}
            {formula.extras && <p className="mt-4 text-sm text-stone">{formula.extras}</p>}
          </li>
        );
      })}
    </ul>
  );
}

type PricingFormulasProps = {
  category: CategoryKey;
  style: "packs" | "services";
  title: string;
  note?: string;
  formulas: PricingFormula[];
  labels: Labels;
  locale: Locale;
  quoteHref: string;
};

/** Pricing section of an event-type page. */
export function PricingFormulas({ category, style, title, note, formulas, labels, locale, quoteHref }: PricingFormulasProps) {
  return (
    <section id="formules" aria-labelledby="pricing-title" className="scroll-mt-20 border-t border-ivory/10 py-20 sm:py-28">
      <Container>
        <h2 id="pricing-title" className="font-display text-4xl font-normal text-balance sm:text-5xl">
          {title}
        </h2>
        <GoldRule className="mt-6" />
        {note && <p className="mt-6 max-w-2xl text-ivory/80">{note}</p>}
        <div className="mt-14">
          <FormulaCards category={category} style={style} formulas={formulas} labels={labels} locale={locale} />
        </div>
        <div className="mt-12">
          <ButtonLink href={quoteHref}>{labels.quote}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
