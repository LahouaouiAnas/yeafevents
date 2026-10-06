import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Default branded Open Graph image (1200x630), used when a page has no specific image. */
export async function GET(_request: Request, { params }: RouteContext<"/og/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { hero } = getDictionary(lang).home;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f6f1ea",
          backgroundColor: "#100e0c",
          backgroundImage:
            "radial-gradient(circle at 80% 15%, rgba(217,140,84,0.45), transparent 55%), radial-gradient(circle at 10% 95%, rgba(163,80,47,0.55), transparent 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontSize: 64, fontFamily: "serif" }}>Yeaf</span>
          <span style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#d9bb88" }}>Events</span>
        </div>
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, fontFamily: "serif", maxWidth: 980 }}>
          {hero.title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
