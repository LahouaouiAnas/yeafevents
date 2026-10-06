import type { RichTextBlock } from "@/lib/content/types";

/** Minimal renderer; will be replaced by Portable Text once Sanity is connected. */
export function RichText({ blocks }: { blocks: RichTextBlock[] }) {
  return (
    <div className="space-y-6 text-lg leading-relaxed text-ivory/85">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="pt-6 font-display text-3xl font-light text-ivory">
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={index} className="list-disc space-y-2 pl-6 marker:text-champagne">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          default:
            return <p key={index}>{block.text}</p>;
        }
      })}
    </div>
  );
}
