import Link from "next/link";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/json-ld";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  return (
    <>
      <nav aria-label={label}>
        <ol className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] text-ivory/60 uppercase">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ivory/90">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="transition-colors hover:text-ivory">
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
