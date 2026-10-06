import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { PostCard } from "@/components/sections/PostCard";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { absoluteUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategory, getPosts } from "@/lib/content";
import type { BlogPost } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { blogPostPath, categoryPath, documentPaths, routePath, routePaths } from "@/lib/routes";
import { articleSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "./shared";

export async function blogIndexMetadata(locale: Locale) {
  const posts = await getPosts(locale);
  return buildMetadata({
    locale,
    ...getDictionary(locale).blog.seo,
    paths: routePaths("blog"),
    noindex: posts.length === 0,
  });
}

export async function BlogIndexView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.blog;
  const posts = await getPosts(locale);

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.blog, path: routePath("blog", locale) })}
          />
        }
      />
      <section className="py-24 sm:py-32">
        <Container>
          {posts.length === 0 ? (
            <p className="max-w-xl text-lg leading-relaxed text-stone">{t.empty}</p>
          ) : (
            <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

export function postMetadata(post: BlogPost, locale: Locale) {
  return buildMetadata({
    locale,
    title: post.seo.title ?? post.title,
    description: post.seo.description ?? post.excerpt,
    paths: documentPaths(post.translations, blogPostPath),
    image: post.seo.image ?? post.cover,
    noindex: post.seo.noindex,
    canonical: post.seo.canonical,
    article: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: post.author ? [post.author] : undefined },
  });
}

export async function PostView({ post, locale }: { post: BlogPost; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.blog;
  const path = blogPostPath(post.slug, locale);
  const relatedCategories = await Promise.all((post.relatedCategories ?? []).map((key) => getCategory(key, locale)));

  return (
    <article>
      <PageHero
        eyebrow={post.categories[0]}
        title={post.title}
        lead={post.excerpt}
        image={post.cover}
        breadcrumbs={
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={breadcrumbTrail(locale, { name: dict.nav.blog, path: routePath("blog", locale) }, { name: post.title, path })}
          />
        }
      >
        <p className="mt-10 text-sm text-stone">
          {t.publishedOn} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          {post.updatedAt && (
            <>
              {" · "}
              {t.updatedOn} <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, locale)}</time>
            </>
          )}
          {post.author && <> · {t.by} {post.author}</>}
        </p>
      </PageHero>

      <Container size="narrow" className="py-20 sm:py-28">
        <RichText blocks={post.body} />
      </Container>

      {post.faq && <FaqSection title={t.faqTitle} items={post.faq} />}

      {/* Every article links back to the money pages: services, Marrakech, quote. */}
      <RelatedLinks
        title={t.related}
        links={[
          ...relatedCategories.map((category) => ({ href: categoryPath(category.key, locale), title: category.label })),
          { href: routePath("marrakech", locale), title: dict.cta.marrakech },
          { href: routePath("projects", locale), title: dict.nav.projects },
        ]}
      />

      <CtaBanner
        title={dict.home.cta.title}
        text={dict.home.cta.text}
        primary={{ href: routePath("contact", locale), label: dict.cta.plan }}
      />

      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.seo.description ?? post.excerpt,
          path,
          locale,
          image: post.cover ? absoluteUrl(post.cover.src) : undefined,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.author,
        })}
      />
    </article>
  );
}
