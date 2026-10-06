import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** Centered serif statement (brand signature, mission). */
export function Statement({ eyebrow, text, children }: { eyebrow?: string; text: string; children?: ReactNode }) {
  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow" className="text-center">
        {eyebrow && <p className="eyebrow mb-8 text-ivory/50">{eyebrow}</p>}
        <p className="reveal font-display text-3xl leading-[1.25] font-light text-balance italic sm:text-[2.75rem]">{text}</p>
        {children && <div className="mt-12 flex justify-center">{children}</div>}
      </Container>
    </section>
  );
}
