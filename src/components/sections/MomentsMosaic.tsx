import { Media } from "@/components/ui/Media";
import type { ImageAsset } from "@/lib/content/types";

export type Moment = { image: ImageAsset; caption: string };

type MomentTrio = [Moment, Moment, Moment];

const imageClassName = "transition-transform duration-[1.6s] ease-out-soft hover:scale-[1.03]";

/**
 * Real photos in offset editorial compositions of three, with controlled sizes
 * (never full-bleed). Each further trio swaps the widths of its outer photos so the
 * rhythm varies. Phones get a compact 2-column layout. The middle photo of each trio
 * is cropped to landscape, so landscape photos fit it best.
 */
export function MomentsMosaic({ moments }: { moments: MomentTrio | [...MomentTrio, ...MomentTrio] }) {
  const trios: MomentTrio[] = [];
  for (let index = 0; index < moments.length; index += 3) {
    trios.push(moments.slice(index, index + 3) as MomentTrio);
  }

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      {trios.map((trio, index) => (
        <Trio key={trio[0].image.src} moments={trio} mirrored={index % 2 === 1} />
      ))}
    </div>
  );
}

function Trio({ moments, mirrored }: { moments: MomentTrio; mirrored: boolean }) {
  const [first, second, third] = moments;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
      <figure className={`reveal ${mirrored ? "lg:col-span-3" : "lg:col-span-4"}`}>
        <Media image={first.image} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" imageClassName={imageClassName} />
        <figcaption className="mt-3 text-xs tracking-[0.16em] text-stone uppercase">{first.caption}</figcaption>
      </figure>
      <figure
        className={`reveal col-span-2 row-start-2 lg:col-span-4 lg:row-start-auto lg:mt-28 ${mirrored ? "lg:col-start-5" : "lg:col-start-6"}`}
      >
        <Media image={second.image} aspect="aspect-[16/10] lg:aspect-[4/3]" sizes="(min-width: 1024px) 32vw, 100vw" imageClassName={imageClassName} />
        <figcaption className="mt-3 text-xs tracking-[0.16em] text-stone uppercase">{second.caption}</figcaption>
      </figure>
      <figure className={`reveal lg:mt-56 ${mirrored ? "lg:col-span-4 lg:col-start-9" : "lg:col-span-3 lg:col-start-10"}`}>
        <Media image={third.image} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" imageClassName={imageClassName} />
        <figcaption className="mt-3 text-xs tracking-[0.16em] text-stone uppercase">{third.caption}</figcaption>
      </figure>
    </div>
  );
}
