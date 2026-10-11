import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type StoryIntroProps = {
  eyebrow?: string;
  title: string;
  body: string[];
  children?: ReactNode;
};

/** Asymmetric, text-led section: large title on the left, reading column on the right. */
export function StoryIntro({ eyebrow, title, body, children }: StoryIntroProps) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          {eyebrow && <p className="eyebrow mb-5 text-ivory/50">{eyebrow}</p>}
          <h2 className="font-display text-4xl leading-[1.05] font-normal text-balance sm:text-5xl">{title}</h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-stone lg:col-span-5 lg:col-start-8 lg:pt-10">
          {body.map((paragraph) => (
            <p key={paragraph} className="reveal">
              {paragraph}
            </p>
          ))}
          {children && <div className="pt-4">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
