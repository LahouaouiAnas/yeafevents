import { lang } from "next/root-params";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routePath } from "@/lib/routes";

export default async function NotFound() {
  const value = await lang();
  // Undefined under /studio, the other root layout.
  const locale = value && hasLocale(value) ? value : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <section className="bg-night">
      <Container className="flex min-h-[80svh] flex-col justify-center py-40">
        <p className="eyebrow text-champagne">404</p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-light sm:text-7xl">{dict.notFound.title}</h1>
        <p className="mt-6 text-lg text-stone">{dict.notFound.text}</p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={routePath("home", locale)}>{dict.notFound.back}</ButtonLink>
          <ButtonLink href={routePath("contact", locale)} variant="outline">
            {dict.cta.contact}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
