import { resolveLocale } from "@/i18n/params";
import { BlogIndexView, blogIndexMetadata } from "@/views/blog";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">) {
  return blogIndexMetadata(await resolveLocale(params));
}

export default async function Page({ params }: PageProps<"/[lang]/blog">) {
  return <BlogIndexView locale={await resolveLocale(params)} />;
}
