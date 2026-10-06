import { Media } from "@/components/ui/Media";
import type { ImageAsset } from "@/lib/content/types";

export type Moment = { image: ImageAsset; caption: string };

/**
 * Three real photos in an offset editorial composition with controlled sizes
 * (never full-bleed). Phones get a compact 2-column layout.
 */
export function MomentsMosaic({ moments }: { moments: [Moment, Moment, Moment] }) {
  const [first, second, third] = moments;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
      <figure className="reveal lg:col-span-4">
        <Media image={first.image} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" imageClassName="transition-transform duration-[1.6s] ease-out-soft hover:scale-[1.03]" />
        <figcaption className="mt-3 text-xs tracking-[0.16em] text-stone uppercase">{first.caption}</figcaption>
      </figure>
      <figure className="reveal col-span-2 row-start-2 lg:col-span-4 lg:col-start-6 lg:row-start-auto lg:mt-28">
        <Media image={second.image} aspect="aspect-[16/10] lg:aspect-[4/3]" sizes="(min-width: 1024px) 32vw, 100vw" imageClassName="transition-transform duration-[1.6s] ease-out-soft hover:scale-[1.03]" />
        <figcaption className="mt-3 text-xs tracking-[0.16em] text-stone uppercase">{second.caption}</figcaption>
      </figure>
      <figure className="reveal lg:col-span-3 lg:col-start-10 lg:mt-56">
        <Media image={third.image} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, 50vw" imageClassName="transition-transform duration-[1.6s] ease-out-soft hover:scale-[1.03]" />
        <figcaption className="mt-3 text-xs tracking-[0.16em] text-stone uppercase">{third.caption}</figcaption>
      </figure>
    </div>
  );
}
