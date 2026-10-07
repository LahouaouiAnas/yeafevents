import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/i18n/params";
import { getPostBySlug, getPosts } from "@/lib/content";
import { PostView, postMetadata } from "@/views/blog";

// Documents published in Sanity after the build are rendered on their first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async (lang) => (await getPosts(lang)).map((post) => ({ lang, slug: post.slug }))),
  );
  return perLocale.flat();
}

async function loadPost(params: PageProps<"/[lang]/blog/[slug]">["params"]) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();
  return { post, locale };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { post, locale } = await loadPost(params);
  return postMetadata(post, locale);
}

export default async function Page({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { post, locale } = await loadPost(params);
  return <PostView post={post} locale={locale} />;
}
