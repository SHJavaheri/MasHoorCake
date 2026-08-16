/**
 * Blocking theme script.
 *
 * Runs synchronously in <head> before first paint so the correct theme class is
 * already on <html> when the browser paints. Without this the page renders
 * light for a frame before hydration corrects it — a white flash that instantly
 * reads as cheap on a site whose dark mode is a selling point.
 *
 * Kept deliberately tiny and dependency-free; next-themes takes over after
 * hydration and manages the same `class` and `localStorage` key.
 */

const STORAGE_KEY = "theme";

// Minified by hand rather than by the bundler, because this is inlined verbatim.
const script = `(function(){try{var e=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=e==="dark"||((!e||e==="system")&&m);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(_){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}

export { STORAGE_KEY as THEME_STORAGE_KEY };
