import { defaultLocale, locales, localeNames, localePath } from "@/lib/i18n/config";

import "./globals.css";

/**
 * Root locale redirect.
 *
 * A static export has no middleware, so locale negotiation cannot happen on the
 * server. This page is the `/index.html` GitHub Pages serves at the origin, and
 * it hands off to a locale in three layers, most capable first:
 *
 *   1. A script that honours a stored preference, then `navigator.language`.
 *   2. A `<meta http-equiv="refresh">` fallback for when scripting is blocked.
 *   3. Visible links, so the page is never a dead end for anyone.
 *
 * `replace` rather than `assign` keeps this page out of session history, so the
 * back button leaves the site instead of bouncing through the redirect again.
 */

// Under GitHub Pages the site is mounted at /<repo>, so the redirect target
// must carry the same prefix Next applies to every other link.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const fallbackHref = `${basePath}${localePath(defaultLocale)}`;

const redirectScript = `(function(){try{
var b=${JSON.stringify(basePath)};
var s=localStorage.getItem("locale");
var supported=${JSON.stringify(locales)};
var target=supported.indexOf(s)>-1?s:null;
if(!target){var n=((navigator.languages&&navigator.languages[0])||navigator.language||"").toLowerCase();
for(var i=0;i<supported.length;i++){if(n.indexOf(supported[i])===0){target=supported[i];break;}}}
location.replace(b+"/"+(target||${JSON.stringify(defaultLocale)})+"/");
}catch(_){location.replace(${JSON.stringify(fallbackHref)});}})();`;

export const metadata = {
  // This page is a redirect shim, not content — keep it out of the index.
  robots: { index: false, follow: true },
};

export default function RootRedirectPage() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${fallbackHref}`} />
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
          <p className="text-text-muted">Choose a language — انتخاب زبان</p>
          <div className="flex gap-4">
            {locales.map((locale) => (
              <a
                key={locale}
                // Plain anchors are not rewritten by Next, so prefix manually.
                href={`${basePath}${localePath(locale)}`}
                className="border-border hover:bg-surface rounded-full border px-6 py-3 transition-colors"
              >
                {localeNames[locale]}
              </a>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
