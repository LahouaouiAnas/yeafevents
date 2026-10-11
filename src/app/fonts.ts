import { Fraunces, Karla } from "next/font/google";

/** Body text: a warm, very legible grotesque. */
export const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

/** Titles and prices: a soft, high-contrast serif with a lively italic for accents. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

export const fontVariables = `${karla.variable} ${fraunces.variable}`;
