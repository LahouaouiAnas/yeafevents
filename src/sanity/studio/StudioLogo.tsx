/** Yeaf Events monogram in the Studio's top bar (workspace icon). */
export function StudioLogo() {
  // eslint-disable-next-line @next/next/no-img-element -- tiny static icon inside the Studio
  return <img src="/media/logo/logo_yeaf.png" alt="" width={28} height={28} style={{ display: "block", borderRadius: 4, background: "#0f0c09" }} />;
}
