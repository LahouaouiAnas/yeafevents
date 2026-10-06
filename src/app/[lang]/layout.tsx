import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/app/fonts";
import "@/app/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/params";
import { organizationSchema, websiteSchema } from "@/lib/seo/json-ld";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0a0908",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  applicationName: siteConfig.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const locale = await resolveLocale(params);

  return (
    <html lang={locale} className={`${fontVariables} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <Header locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
        <JsonLd data={[organizationSchema(getDictionary(locale).footer.tagline), websiteSchema(locale)]} />
      </body>
    </html>
  );
}
