import Link from "next/link";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import type { ShowcaseItem } from "@/lib/content/types";

type ShowcaseFeatureProps = {
  item: ShowcaseItem;
  index: number;
  related?: { href: string; label: string; title: string };
  playLabel: string;
};

/**
 * Column placement on large screens. The cover follows the photo's shape (landscape covers
 * get more width and a 3:2 frame, portrait ones a 4:5 frame) and alternates sides.
 */
const layouts = {
  landscape: {
    cover: "lg:col-span-7",
    coverFlipped: "lg:col-span-7 lg:col-start-6 lg:order-2",
    text: "lg:col-span-4 lg:col-start-9",
    textFlipped: "lg:col-span-4 lg:col-start-1 lg:order-1",
    aspect: "aspect-[4/3] lg:aspect-[3/2]",
    sizes: "(min-width: 1024px) 56vw, 100vw",
  },
  portrait: {
    cover: "lg:col-span-5",
    coverFlipped: "lg:col-span-5 lg:col-start-8 lg:order-2",
    text: "lg:col-span-5 lg:col-start-7",
    textFlipped: "lg:col-span-5 lg:col-start-2 lg:order-1",
    aspect: "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]",
    sizes: "(min-width: 1024px) 40vw, 100vw",
  },
} as const;

/** One chapter of the projects page: cover beside its story, then a row of medium gallery tiles. */
export function ShowcaseFeature({ item, index, related, playLabel }: ShowcaseFeatureProps) {
  const flipped = index % 2 === 1;
  const layout = layouts[item.cover && item.cover.height > item.cover.width ? "portrait" : "landscape"];
  const hasGallery = item.gallery.length > 0 || Boolean(item.video);

  return (
    <article id={item.id} className="scroll-mt-28 border-t border-ivory/10 py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
        {item.cover && (
          <div className={flipped ? layout.coverFlipped : layout.cover}>
            <Media image={item.cover} aspect={layout.aspect} sizes={layout.sizes} className="reveal" />
          </div>
        )}

        <div className={`lg:self-center ${flipped ? layout.textFlipped : layout.text}`}>
          <p className="font-display text-lg text-ivory/40">{String(index + 1).padStart(2, "0")}</p>
          <p className="mt-5 eyebrow text-ivory/50">{item.label}</p>
          <h2 className="mt-4 font-display text-4xl leading-tight font-light sm:text-5xl">{item.title}</h2>
          <p className="mt-5 leading-relaxed text-stone">{item.description}</p>
          {related && (
            <div className="mt-8">
              <p className="eyebrow text-ivory/50">{related.label}</p>
              <Link
                href={related.href}
                className="mt-3 inline-block font-display text-2xl font-light underline decoration-ivory/30 underline-offset-8 hover:decoration-champagne"
              >
                {related.title}
              </Link>
            </div>
          )}
        </div>

        {hasGallery && (
          <ul className="grid grid-cols-3 gap-3 sm:gap-4 lg:order-3 lg:col-span-12 lg:grid-cols-4 lg:gap-8">
            {item.gallery.map((image) => (
              <li key={image.src} className="reveal">
                <Media
                  image={image}
                  aspect="aspect-[3/4] lg:aspect-[4/5]"
                  sizes="(min-width: 1024px) 22vw, 30vw"
                  imageClassName="transition-transform duration-[1.6s] ease-out-soft hover:scale-[1.03]"
                />
              </li>
            ))}
            {item.video && (
              <li className="reveal aspect-[3/4] lg:aspect-[4/5]">
                <VideoPlayer video={item.video} label={playLabel} />
              </li>
            )}
          </ul>
        )}
      </Container>
    </article>
  );
}
