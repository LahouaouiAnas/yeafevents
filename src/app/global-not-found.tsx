import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Yeaf Events",
  robots: { index: false, follow: true },
};

/** Fallback for URLs outside /fr and /en, where no localized layout applies. */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${fontVariables} antialiased`}>
      <body className="bg-night text-ivory">
        <main className="mx-auto flex min-h-svh max-w-4xl flex-col justify-center px-5 sm:px-8">
          <p className="eyebrow text-champagne">404</p>
          <h1 className="mt-6 font-display text-5xl font-normal sm:text-6xl">Page introuvable</h1>
          <p lang="en" className="mt-3 font-display text-2xl font-normal text-ivory/60">
            Page not found
          </p>
          <ul className="mt-12 flex gap-8 text-sm">
            <li>
              <Link href="/fr" className="underline decoration-champagne underline-offset-8">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/en" lang="en" className="underline decoration-champagne underline-offset-8">
                Home
              </Link>
            </li>
          </ul>
        </main>
      </body>
    </html>
  );
}
