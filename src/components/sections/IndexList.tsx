import Image from "next/image";
import Link from "next/link";
import type { ImageAsset } from "@/lib/content/types";

export type IndexItem = { href: string; title: string; text: string; image?: ImageAsset };

/** Typographic index of destinations (categories, services), with an optional small thumbnail. */
export function IndexList({ items, headingLevel: Heading = "h3" }: { items: IndexItem[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="border-t border-ivory/10">
      {items.map((item, index) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-ivory/10 py-6 transition-colors duration-500 hover:bg-coal sm:grid-cols-[3.5rem_1fr_1.2fr_auto] sm:px-4"
          >
            <span className="font-display text-lg text-ivory/40">{String(index + 1).padStart(2, "0")}</span>
            <Heading className="font-display text-2xl font-normal sm:text-3xl">{item.title}</Heading>
            <p className="hidden text-sm leading-relaxed text-stone sm:block">{item.text}</p>
            <span className="flex items-center gap-4">
              {item.image && (
                <span className="relative hidden aspect-[4/5] w-14 overflow-hidden bg-graphite md:block">
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </span>
              )}
              <span aria-hidden="true" className="text-ivory/60 transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
