import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

type CtaBannerProps = {
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/** Closing call to action: oversized heading on the left, one clear action on the right. */
export function CtaBanner({ title, text, primary, secondary }: CtaBannerProps) {
  return (
    <section className="border-t border-ivory/10 bg-night">
      <Container className="grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="font-display text-4xl leading-[1.04] font-light text-balance sm:text-6xl lg:col-span-7">{title}</h2>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="leading-relaxed text-stone">{text}</p>
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
