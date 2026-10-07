import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { ArchFrame, StarMark } from "@/components/ui/Ornaments";
import type { ImageAsset } from "@/lib/content/types";

type ApproachStepsProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  steps: { title: string; text: string }[];
  /** Optional photo under the heading. */
  image?: ImageAsset;
};

/** The agency's four-step process, as a compact numbered grid beside its heading. */
export function ApproachSteps({ eyebrow, title, lead, steps, image }: ApproachStepsProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-ivory/10 bg-coal py-20 sm:py-28">
      <StarMark spin className="pointer-events-none absolute -top-56 -right-56 -z-10 size-[34rem] opacity-[0.07] sm:-top-72 sm:-right-72 sm:size-[46rem]" />
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="eyebrow text-ivory/50">{eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-light text-balance sm:text-5xl">{title}</h2>
          {lead && <p className="mt-5 leading-relaxed text-stone">{lead}</p>}
          {image && (
            <ArchFrame className="reveal mx-auto mt-12 w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none">
              <Media image={image} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 384px" position="center 40%" className="h-full" />
            </ArchFrame>
          )}
        </div>
        <ol className="grid content-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {steps.map((step, index) => (
            <li key={step.title} className="reveal border-t border-ivory/15 pt-6">
              <span className="font-display text-lg text-champagne">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl font-light">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
