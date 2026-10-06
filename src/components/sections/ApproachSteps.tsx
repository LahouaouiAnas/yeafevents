import { Container } from "@/components/ui/Container";

type ApproachStepsProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  steps: { title: string; text: string }[];
};

/** The agency's four-step process, as a compact numbered grid beside its heading. */
export function ApproachSteps({ eyebrow, title, lead, steps }: ApproachStepsProps) {
  return (
    <section className="border-y border-ivory/10 bg-coal py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="eyebrow text-ivory/50">{eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-light text-balance sm:text-5xl">{title}</h2>
          {lead && <p className="mt-5 leading-relaxed text-stone">{lead}</p>}
        </div>
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
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
