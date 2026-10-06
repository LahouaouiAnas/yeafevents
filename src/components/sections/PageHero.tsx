import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
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
 * Inner-page hero carrying the page's single H1. Editorial split: text first, then a
 * contained photo (never full-bleed), so the content stays readable at every width.
 */
export function PageHero({ eyebrow, title, lead, breadcrumbs, image, imagePosition, children }: PageHeroProps) {
  return (
    <section className="bg-night">
      <Container className="grid gap-10 pt-28 pb-14 sm:pt-36 sm:pb-20 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className={image ? "lg:col-span-6" : "lg:col-span-9"}>
          {breadcrumbs}
          {eyebrow && <p className="eyebrow mt-10 text-ivory/50">{eyebrow}</p>}
          <h1 className="mt-5 font-display text-[2.4rem] leading-[1.04] font-light text-balance break-words sm:text-6xl lg:text-[4.25rem]">
            {title}
          </h1>
          {lead && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">{lead}</p>}
          {children}
        </div>
        {image && (
          <Media
            image={image}
            aspect="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
            position={imagePosition}
            sizes="(min-width: 1024px) 38vw, 100vw"
            preload
            className="lg:col-span-5 lg:col-start-8 lg:max-h-[38rem]"
            imageClassName="settle"
          />
        )}
      </Container>
    </section>
  );
}
