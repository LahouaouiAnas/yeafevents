import { ButtonLink } from "@/components/ui/ButtonLink";
import { Media } from "@/components/ui/Media";
import { ArchOutline, GoldRule, StarMark, ZelligePattern } from "@/components/ui/Ornaments";
import type { ImageAsset } from "@/lib/content/types";

type ArchHeroProps = {
  /** Short line above the title (who we are, where). */
  kicker: string;
  title: string;
  /** Second line of the title, in gold italics. */
  accent: string;
  text: string;
  image: ImageAsset;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/**
 * Home hero, split in two: the message on the left, one photo cut to a pointed Moroccan arch on
 * the right, with an offset gold outline and a star medallion. Text first in reading order; the
 * photo is the page's LCP image.
 */
export function ArchHero({ kicker, title, accent, text, image, primary, secondary }: ArchHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <ZelligePattern fade="left" className="opacity-[0.07]" />
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow flex items-center gap-4 text-champagne">
            <span aria-hidden="true" className="h-px w-10 bg-champagne" />
            {kicker}
          </p>
          <h1 className="mt-7 font-display text-[2.7rem] leading-[1.04] font-normal text-balance sm:text-6xl lg:text-[4.4rem]">
            {title}
            <span className="mt-2 block text-gold-soft italic">{accent}</span>
          </h1>
          <GoldRule className="mt-8" />
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/85">{text}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="outline" target="_blank" rel="noopener noreferrer">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-[min(82vw,28rem)] lg:col-span-5 lg:col-start-8 lg:w-full lg:max-w-[30rem]">
          <ArchOutline className="absolute inset-0 -z-10 size-full translate-x-4 -translate-y-4 opacity-60 sm:translate-x-6 sm:-translate-y-6" />
          <Media
            image={image}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 480px, 82vw"
            preload
            className="arch"
            imageClassName="settle"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -left-6 flex size-24 items-center justify-center rounded-full border border-champagne/50 bg-night sm:-left-10 sm:size-32"
          >
            <StarMark spin className="size-16 sm:size-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
