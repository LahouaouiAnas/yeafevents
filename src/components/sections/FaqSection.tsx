import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Faq } from "@/lib/content/types";
import { faqSchema } from "@/lib/seo/json-ld";

type FaqSectionProps = {
  eyebrow?: string;
  title: string;
  items: Faq[];
  /** Emit FAQPage JSON-LD. Use on one FAQ block per page only. */
  structuredData?: boolean;
};

/** Native <details> accordion: accessible, keyboard-friendly, zero JS. */
export function FaqSection({ eyebrow, title, items, structuredData = true }: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="border-t border-ivory/10">
          {items.map((item) => (
            <details key={item.question} className="group border-b border-ivory/10">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 font-display text-2xl font-normal [&::-webkit-details-marker]:hidden">
                <h3>{item.question}</h3>
                <span aria-hidden="true" className="mt-1 text-champagne transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-8 leading-relaxed text-stone">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
      {structuredData && <JsonLd data={faqSchema(items)} />}
    </section>
  );
}
