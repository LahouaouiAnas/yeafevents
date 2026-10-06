import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/lib/content/types";

/** Renders nothing until real testimonials exist. */
export function Testimonials({ eyebrow, title, items }: { eyebrow: string; title: string; items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-y border-ivory/10 bg-coal py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ul className="mt-16 grid gap-12 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.author} className="reveal">
              <figure>
                <blockquote className="font-display text-2xl leading-snug font-light">“{item.quote}”</blockquote>
                <figcaption className="mt-6 text-sm text-stone">
                  <span className="font-medium text-ivory">{item.author}</span>
                  {item.role && <>, {item.role}</>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
