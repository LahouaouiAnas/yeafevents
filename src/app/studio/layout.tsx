import { jost } from "@/app/fonts";

/** Root layout of the embedded Sanity Studio, separate from the public site's layout. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jost.variable}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
