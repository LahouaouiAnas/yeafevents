import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { StarBullet, Wave } from "@/components/ui/Ornaments";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PricingFormula } from "@/lib/content/types";

type PricingFormulasProps = {
  title: string;
  note?: string;
  formulas: PricingFormula[];
  labels: Dictionary["category"]["pricing"];
  locale: Locale;
  quoteHref: string;
};

const numberLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

/**
 * Priced packages, as a list: name and "from" price on one line, the audience below, and the
 * inclusions in a table behind a native disclosure (works without JavaScript).
 */
export function PricingFormulas({ title, note, formulas, labels, locale, quoteHref }: PricingFormulasProps) {
  const format = (value: number) => new Intl.NumberFormat(numberLocale[locale], { maximumFractionDigits: 0 }).format(value);

  return (
    <section aria-labelledby="pricing-title" className="relative isolate border-t border-ivory/10 py-20 sm:py-28">
      <Container size="narrow">
        <StarBullet className="size-6" />
        <h2 id="pricing-title" className="mt-5 font-display text-4xl font-normal text-balance sm:text-5xl">
          {title}
        </h2>
        <Wave className="mt-6" />
        {note && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ivory/85">{note}</p>}

        <ul className="mt-12 border-t border-ivory/10">
          {formulas.map((formula) => {
            const main = formula.priceEur ? `${format(formula.priceEur)} €` : `${format(formula.priceMad!)} MAD`;
            const secondary = formula.priceEur && formula.priceMad ? `${labels.approx} ${format(formula.priceMad)} MAD` : undefined;
            return (
              <li key={formula.name} className="reveal border-b border-ivory/10 py-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="flex items-start gap-4">
                    <StarBullet className="mt-3 size-5 shrink-0" />
                    <div>
                      <h3 className={`font-display text-3xl font-normal sm:text-4xl ${formula.featured ? "text-gold-soft" : ""}`}>
                        {formula.name}
                      </h3>
                      {formula.featured && (
                        <p className="mt-2 inline-block rounded-full border border-champagne/50 px-3 py-0.5 text-xs font-bold tracking-wider text-gold-soft uppercase">
                          {labels.featured}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pl-10 sm:pl-0 sm:text-right">
                    <p className="font-display text-3xl whitespace-nowrap text-gold-soft sm:text-4xl">
                      <span className="text-[0.75em]">{labels.from}</span> {main}
                    </p>
                    {secondary && <p className="mt-1 text-sm tracking-wider text-ivory/70">{secondary}</p>}
                  </div>
                </div>

                <div className="pl-10">
                  {formula.audience && <p className="mt-4 text-lg text-ivory/85">{formula.audience}</p>}
                  {formula.inclusions.length > 0 && (
                    <details className="group mt-5">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-3 font-bold text-gold-soft [&::-webkit-details-marker]:hidden">
                        {labels.included}
                        <span aria-hidden="true" className="text-lg transition-transform duration-300 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="mt-5 overflow-hidden rounded-2xl border border-ivory/10">
                        <table className="w-full text-left">
                          <thead className="bg-coal">
                            <tr>
                              <th scope="col" className="eyebrow px-5 py-4 text-champagne">
                                {labels.itemColumn}
                              </th>
                              <th scope="col" className="eyebrow px-5 py-4 text-champagne">
                                {labels.detailColumn}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ivory/10">
                            {formula.inclusions.map((row) => (
                              <tr key={row.label}>
                                <th scope="row" className="w-1/3 px-5 py-4 align-top font-bold">
                                  {row.label}
                                </th>
                                <td className="px-5 py-4 text-ivory/85">{row.detail}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12">
          <ButtonLink href={quoteHref}>{labels.quote}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
