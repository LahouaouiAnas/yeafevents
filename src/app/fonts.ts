import { Bodoni_Moda, Jost } from "next/font/google";

/** Body text and labels: a clean geometric sans that reads well at every size. */
export const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

/** Titles and prices: a high-contrast Didone, with an elegant italic for accents. */
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

export const fontVariables = `${jost.variable} ${bodoni.variable}`;
