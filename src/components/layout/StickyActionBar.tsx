"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, MessageCircle, PenLine } from "lucide-react";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { transition } from "@/lib/motion/tokens";

/**
 * Thumb-reachable action bar for small screens.
 *
 * Appears only once the hero is behind you: over the hero it competes with the
 * primary calls to action, and covering the first screen of a photography-led
 * page with a toolbar is exactly the wrong first impression.
 *
 * Sits above the iOS home indicator via `env(safe-area-inset-bottom)`.
 *
 * Hidden on /design, which has its own bottom bar carrying the running estimate
 * — two stacked bars would eat a third of a phone screen. Checked here rather
 * than passed down as a prop because the layout that mounts this is a Server
 * Component and cannot read the pathname.
 */
export function StickyActionBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { isScrolled } = useScrollDirection();
  const pathname = usePathname() ?? "";

  const actions = [
    { href: localePath(locale, "/gallery"), label: dict.nav.gallery, Icon: Images },
    {
      href: localePath(locale, "/design"),
      label: dict.nav.design,
      Icon: PenLine,
      primary: true,
    },
    { href: localePath(locale, "/contact"), label: dict.nav.contact, Icon: MessageCircle },
  ];

  if (pathname.includes("/design")) return null;

  return (
    <motion.div
      initial={false}
      animate={{ y: isScrolled ? 0 : 120, opacity: isScrolled ? 1 : 0 }}
      transition={transition.fast}
      className="border-border bg-bg/90 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav aria-label="Quick actions" className="mx-auto flex max-w-md items-stretch">
        {actions.map(({ href, label, Icon, primary }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 text-xs transition-colors ${
              primary ? "text-accent" : "text-text-muted hover:text-text"
            }`}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
