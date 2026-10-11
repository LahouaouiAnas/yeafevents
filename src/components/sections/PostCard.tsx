import Link from "next/link";
import { Media } from "@/components/ui/Media";
import type { Locale } from "@/i18n/config";
import type { BlogPost } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { blogPostPath } from "@/lib/routes";

export function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <article className="group">
      <Link href={blogPostPath(post.slug, locale)} className="block">
        <Media
          image={post.cover}
          aspect="aspect-[3/2]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <p className="mt-5 text-xs tracking-[0.14em] text-stone uppercase">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          {post.categories[0] && <> · {post.categories[0]}</>}
        </p>
        <h2 className="mt-3 font-display text-3xl font-normal group-hover:underline group-hover:decoration-champagne group-hover:decoration-1 group-hover:underline-offset-8">
          {post.title}
        </h2>
        <p className="mt-3 leading-relaxed text-stone">{post.excerpt}</p>
      </Link>
    </article>
  );
}
