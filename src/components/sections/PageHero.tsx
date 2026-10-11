import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Wave } from "@/components/ui/Ornaments";
import type { ImageAsset } from "@/lib/content/types";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: ReactNode;
  image?: ImageAsset;
  imagePosition?: string;
  children?: ReactNode;
};

/**
 * Inner-page hero carrying the page's single H1: gold eyebrow, large serif title, wavy rule,
 * lead and actions, with the photo in a Moroccan arch beside it.
 */
export function PageHero({ eyebrow, title, lead, breadcrumbs, image, imagePosition, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-night">
      {image && (
        <div
          aria-hidden="true"
          className="absolute top-1/3 right-0 -z-10 size-[40rem] translate-x-1/4 rounded-full bg-[radial-gradient(closest-side,rgb(217_169_78/0.16),transparent)] blur-2xl"
        />
      )}
      <Container className="grid gap-12 pt-28 pb-16 sm:pt-32 sm:pb-24 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className={image ? "lg:col-span-7" : "lg:col-span-9"}>
          {breadcrumbs}
          {eyebrow && <p className="eyebrow mt-10 text-champagne">{eyebrow}</p>}
          <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] font-normal text-balance break-words sm:text-6xl lg:text-[4.25rem]">
            {title}
          </h1>
          <Wave className="mt-7" />
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">{lead}</p>}
          {children}
        </div>
        {image && (
          <Media
            image={image}
            aspect="aspect-[4/5]"
            position={imagePosition}
            sizes="(min-width: 1024px) 34vw, 90vw"
            preload
            className="mx-auto w-full max-w-md rounded-t-full shadow-[0_40px_120px_-40px_rgb(217_169_78/0.45)] lg:col-span-5 lg:max-w-none"
            imageClassName="settle"
          />
        )}
      </Container>
    </section>
  );
}
