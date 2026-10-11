import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type RelatedLink = { href: string; title: string; text?: string };

/** Internal linking block: keeps key pages connected to each other. */
export function RelatedLinks({ title, links }: { title: string; links: RelatedLink[] }) {
  if (links.length === 0) return null;

  return (
    <section className="border-t border-ivory/10 py-16 sm:py-20">
      <Container>
        <h2 className="font-display text-3xl font-normal sm:text-4xl">{title}</h2>
        <ul className="mt-10 grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href} className="bg-night">
              <Link href={link.href} className="group flex h-full flex-col gap-3 p-8 transition-colors hover:bg-coal">
                <span className="flex items-center justify-between gap-4 font-display text-2xl font-normal">
                  {link.title}
                  <span aria-hidden="true" className="text-ivory/60 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
                {link.text && <span className="text-sm leading-relaxed text-stone">{link.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
