"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SprinkleBurst } from "@/components/easter-eggs/SprinkleBurst";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/ui/Button";
import { navRoutes } from "@/config/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

/**
 * Site header.
 *
 * Hides on scroll-down and returns on scroll-up: on a photography-led page the
 * header is mostly in the way, but it must be one gesture from reach at any
 * scroll position, since "Start an Order" lives here.
 *
 * It stays put while a mobile menu is open — retracting the header out from
 * under an open menu is disorienting.
 */
export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { direction, isScrolled } = useScrollDirection();
  const pathname = usePathname() ?? "";

  return (
    <motion.header
      initial={false}
      animate={{ y: direction === "down" ? "-100%" : "0%" }}
      transition={transition.fast}
      className={cn(
        "fixed inset-x-0 top-0 z-40",
        // In light mode the dark wordmark and links need a stable surface over
        // hero photography. Dark mode's image treatment already provides that
        // contrast, so it keeps the deliberately transparent opening state.
        isScrolled
          ? "border-border bg-bg/80 border-b backdrop-blur-xl"
          : "bg-bg/95 shadow-[var(--shadow-sm)] dark:bg-transparent dark:shadow-none",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-[88rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Long-pressing the logo spills sprinkles. */}
        <SprinkleBurst>
          <Link
            href={localePath(locale)}
            className="rounded-sm transition-opacity hover:opacity-70"
            aria-label={dict.nav.home}
          >
            <Wordmark className="h-7 w-auto" />
          </Link>
        </SprinkleBurst>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navRoutes.map((route) => {
            const href = localePath(locale, route.path);
            const isActive = pathname.startsWith(href.replace(/\/$/, ""));
            return (
              <Link
                key={route.path}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors duration-[var(--duration-fast)]",
                  isActive ? "text-text" : "text-text-muted hover:text-text",
                )}
              >
                {dict.nav[route.labelKey]}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="bg-accent absolute inset-x-4 -bottom-0.5 h-px"
                    transition={transition.fast}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher
            locale={locale}
            label={dict.locale.label}
            className="hidden sm:flex"
          />
          <ThemeToggle label={dict.theme.toggle} />
          <Button
            href={localePath(locale, "/order")}
            size="sm"
            className="hidden lg:inline-flex"
          >
            {dict.nav.order}
          </Button>
          <MobileNav locale={locale} dict={dict} />
        </div>
      </div>
    </motion.header>
  );
}
