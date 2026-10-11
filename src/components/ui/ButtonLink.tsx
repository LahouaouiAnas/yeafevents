import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "solid" | "outline" | "text";

const variants: Record<Variant, string> = {
  solid: "btn-gold px-8 py-4 text-base font-bold",
  outline: "rounded-full border border-ivory/30 px-8 py-4 text-base font-bold text-ivory hover:border-champagne hover:text-gold-soft",
  text: "text-gold-soft font-bold",
};

const textLabel =
  "underline decoration-champagne/50 underline-offset-[6px] transition-colors duration-500 group-hover/button:decoration-gold-soft";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "solid", className = "", children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`group/button inline-flex items-center justify-center gap-3 transition-colors duration-500 ${variants[variant]} ${className}`}
      {...props}
    >
      <span className={variant === "text" ? textLabel : undefined}>{children}</span>
      <span aria-hidden="true" className="transition-transform duration-500 group-hover/button:translate-x-1">
        →
      </span>
    </Link>
  );
}
