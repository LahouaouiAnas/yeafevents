import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import type { ImageAsset } from "@/lib/content/types";

type CtaBannerProps = {
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  /** Optional backdrop photo, darkened so the text stays readable. */
  image?: ImageAsset;
};

/** Closing call to action: oversized heading on the left, one clear action on the right. */
export function CtaBanner({ title, text, primary, secondary, image }: CtaBannerProps) {
  return (
    <section className={`relative isolate overflow-hidden border-t border-ivory/10 bg-night ${image ? "min-h-[32rem]" : ""}`}>
      {image && (
        <>
          <Media image={image} layout="cover" sizes="100vw" decorative className="-z-20" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/80 to-night/40" />
        </>
      )}
      <Container className={`grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:items-end lg:gap-8 ${image ? "sm:pt-48" : ""}`}>
        <h2 className="font-display text-4xl leading-[1.04] font-light text-balance sm:text-6xl lg:col-span-7">{title}</h2>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className={`leading-relaxed ${image ? "text-ivory/80" : "text-stone"}`}>{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="outline">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
