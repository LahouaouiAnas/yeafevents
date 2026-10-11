import { ButtonLink } from "@/components/ui/ButtonLink";
import { Media } from "@/components/ui/Media";
import { Wave } from "@/components/ui/Ornaments";
import type { ImageAsset } from "@/lib/content/types";

type ArchHeroProps = {
  title: string;
  /** Second line of the title, in gold italics. */
  accent: string;
  subtitle: string;
  text: string;
  image: ImageAsset;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/**
 * Home hero: one photo in a Moroccan arch, centered, with the title overlapping its base and
 * a warm glow behind it. Text first in reading order; the photo is the page's LCP image.
 */
export function ArchHero({ title, accent, subtitle, text, image, primary, secondary }: ArchHeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-5 pt-28 pb-20 text-center sm:pt-32 sm:pb-28">
      <div
        aria-hidden="true"
        className="absolute top-24 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(217_169_78/0.22),transparent)] blur-2xl"
      />
      <div className="relative mx-auto w-[min(78vw,26rem)]">
        <Media
          image={image}
          aspect="aspect-[4/5]"
          sizes="(min-width: 640px) 416px, 78vw"
          preload
          className="rounded-t-full [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)]"
          imageClassName="settle"
        />
      </div>

      <div className="relative mx-auto -mt-28 max-w-4xl sm:-mt-36">
        <h1 className="font-display text-[2.6rem] leading-[1.05] font-medium text-balance sm:text-6xl lg:text-7xl">
          {title}
          <span className="mt-1 block font-normal text-gold-soft italic">{accent}</span>
        </h1>
        <p className="mt-6 font-display text-xl text-ivory/85 italic sm:text-2xl">{subtitle}</p>
        <Wave className="mx-auto mt-6" />
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">{text}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href} variant="outline" target="_blank" rel="noopener noreferrer">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
