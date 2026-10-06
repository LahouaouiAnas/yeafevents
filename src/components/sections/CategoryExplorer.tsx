"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ImageAsset } from "@/lib/content/types";

export type ExplorerItem = {
  key: string;
  href: string;
  label: string;
  phrase: string;
  image?: ImageAsset;
};

/**
 * Event categories as an editorial index. On large screens, hovering or focusing a line
 * swaps the photo beside the list; on small screens each line carries its own thumbnail.
 */
export function CategoryExplorer({ items }: { items: ExplorerItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <ul className="border-t border-ivory/10 lg:col-span-7">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.key} className="border-b border-ivory/10">
              <Link
                href={item.href}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 py-5 sm:grid-cols-[7rem_1fr] lg:grid-cols-[3rem_1fr_auto] lg:gap-6 lg:py-7"
              >
                {item.image ? (
                  <span className="relative aspect-[4/5] overflow-hidden bg-graphite lg:hidden">
                    <Image src={item.image.src} alt="" fill sizes="112px" className="object-cover" />
                  </span>
                ) : (
                  <span aria-hidden="true" className="media-fallback aspect-[4/5] lg:hidden" />
                )}
                <span aria-hidden="true" className="hidden font-display text-lg text-ivory/40 lg:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span
                    className={`block font-display text-3xl leading-tight font-light transition-colors duration-500 sm:text-4xl xl:text-5xl ${
                      isActive ? "lg:text-ivory" : "lg:text-ivory/45"
                    } group-hover:text-ivory`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-2 block text-sm leading-relaxed text-stone transition-opacity duration-500 ${
                      isActive ? "lg:opacity-100" : "lg:opacity-0"
                    }`}
                  >
                    {item.phrase}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`hidden text-ivory/60 transition-transform duration-500 lg:block ${isActive ? "translate-x-0" : "-translate-x-2 opacity-0"}`}
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div aria-hidden="true" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="sticky top-28 aspect-[4/5] max-h-[36rem] overflow-hidden bg-graphite">
          {items.map((item, index) =>
            item.image ? (
              <Image
                key={item.key}
                src={item.image.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 400px, 33vw"
                className={`object-cover transition-[opacity,transform] duration-700 ease-out-soft ${
                  index === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                }`}
              />
            ) : (
              <span
                key={item.key}
                className={`media-fallback absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
