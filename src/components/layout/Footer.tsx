import Link from "next/link";

import { CandlelightToggle } from "@/components/easter-eggs/CandlelightToggle";
import { Wordmark } from "@/components/layout/Wordmark";
import { Container } from "@/components/ui/Container";
import { OrnamentDivider } from "@/components/ui/Ornament";
import { navRoutes } from "@/config/navigation";
import { site } from "@/config/site";
import { contactChannels } from "@/lib/contact/channels";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const channels = contactChannels(dict.contact.chatGreeting);

  return (
    <footer className="border-border bg-bg-subtle relative mt-auto border-t">
      <Container className="py-16 sm:py-20">
        <OrnamentDivider className="mb-14" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark className="h-7 w-auto" />
            <p className="text-text-muted mt-5 max-w-sm text-sm">{site.description[locale]}</p>
            <p className="text-text-subtle mt-4 text-sm">{site.serviceArea[locale]}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-text-subtle text-sm tracking-[0.2em] uppercase">
              {dict.nav.home}
            </h2>
            <ul className="mt-5 space-y-3">
              {navRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={localePath(locale, route.path)}
                    className="text-text-muted hover:text-accent text-sm transition-colors"
                  >
                    {dict.nav[route.labelKey]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={localePath(locale, "/order")}
                  className="text-text-muted hover:text-accent text-sm transition-colors"
                >
                  {dict.nav.order}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-text-subtle text-sm tracking-[0.2em] uppercase">
              {dict.nav.contact}
            </h2>
            <ul className="mt-5 space-y-3">
              {channels.map((channel) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    <channel.Icon className="size-4 shrink-0" aria-hidden="true" />
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border text-text-subtle mt-16 flex flex-col items-start justify-between gap-4 border-t pt-8 text-sm sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-3">
            <span>{dict.footer.craftedNote}</span>
            {/* Dark-mode-only Easter egg. Renders nothing in light mode. */}
            <CandlelightToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
