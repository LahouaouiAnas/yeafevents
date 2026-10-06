import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, lead, as: Heading = "h2", align = "left", className = "" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="eyebrow mb-5 text-ivory/50">{eyebrow}</p>
      )}
      <Heading id={id} className="font-display text-4xl leading-[1.05] font-light text-balance sm:text-5xl">
        {title}
      </Heading>
      {lead && <p className="mt-6 text-lg leading-relaxed text-pretty text-stone">{lead}</p>}
    </div>
  );
}
