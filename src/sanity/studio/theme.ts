import { buildLegacyTheme } from "sanity";

/**
 * Studio colours: a clear, light workspace with the gold of the Yeaf logo as the accent, and
 * strong text contrast. The text face is Jost, the site's own (loaded in src/app/studio/layout.tsx).
 */
export const studioTheme = buildLegacyTheme({
  "--black": "#1c1712",
  "--white": "#ffffff",
  "--gray": "#6b6259",
  "--gray-base": "#6b6259",
  "--component-bg": "#ffffff",
  "--component-text-color": "#1c1712",
  "--brand-primary": "#a87a24",
  "--default-button-color": "#5c544c",
  "--default-button-primary-color": "#a87a24",
  "--default-button-success-color": "#2f7d4f",
  "--default-button-warning-color": "#b7791f",
  "--default-button-danger-color": "#b23a3a",
  "--state-info-color": "#2f6f9f",
  "--state-success-color": "#2f7d4f",
  "--state-warning-color": "#b7791f",
  "--state-danger-color": "#b23a3a",
  "--main-navigation-color": "#17130f",
  "--main-navigation-color--inverted": "#f3ece1",
  "--focus-color": "#a87a24",
  "--font-family-base": "var(--font-jost), 'Jost', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
});
