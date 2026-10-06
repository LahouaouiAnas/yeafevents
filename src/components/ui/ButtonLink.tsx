import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "solid" | "outline" | "text";

const variants: Record<Variant, string> = {
  solid: "bg-ivory text-night hover:bg-champagne px-7 py-4",
  outline: "border border-ivory/35 text-ivory hover:border-ivory hover:bg-ivory hover:text-night px-7 py-4",
  text: "text-ivory",
};

const textLabel =
  "underline decoration-ivory/30 underline-offset-[10px] transition-colors duration-500 group-hover/button:decoration-champagne";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "solid", className = "", children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`group/button inline-flex items-center justify-center gap-3 text-xs font-medium tracking-[0.18em] uppercase transition-colors duration-500 ${variants[variant]} ${className}`}
      {...props}
    >
      <span className={variant === "text" ? textLabel : undefined}>{children}</span>
      <span aria-hidden="true" className="transition-transform duration-500 group-hover/button:translate-x-1">
        →
      </span>
    </Link>
  );
}
