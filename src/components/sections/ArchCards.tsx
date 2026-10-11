import Link from "next/link";
import { Media } from "@/components/ui/Media";
import type { ImageAsset } from "@/lib/content/types";

export type ArchCard = { key: string; href: string; label: string; phrase: string; image?: ImageAsset };

/**
 * Event types as arched photo cards: title, gold italic phrase, link. Three per row on large
 * screens; an incomplete last row stays centered.
 */
export function ArchCards({ items, linkLabel }: { items: ArchCard[]; linkLabel: string }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-8 gap-y-16">
      {items.map((item) => (
        <li key={item.key} className="reveal w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
          <Link href={item.href} className="group block">
            <Media
              image={item.image}
              aspect="aspect-[4/5]"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="rounded-t-full shadow-[0_30px_80px_-40px_rgb(217_169_78/0.5)]"
              imageClassName="transition-transform duration-[1.6s] ease-out-soft group-hover:scale-[1.04]"
            />
            <h3 className="mt-7 font-display text-3xl font-medium sm:text-[2rem]">{item.label}</h3>
            <p className="mt-1 font-display text-lg text-gold-soft italic">{item.phrase}</p>
            <span className="mt-4 inline-flex items-center gap-2 font-bold text-gold-soft">
              <span className="underline decoration-champagne/50 underline-offset-[6px] transition-colors duration-500 group-hover:decoration-gold-soft">
                {linkLabel}
              </span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
