"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Button } from "@/components/ui/Button";
import { KhatamPattern } from "@/components/ui/Ornament";
import { navRoutes } from "@/config/navigation";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { easeEntrance, transition } from "@/lib/motion/tokens";

/**
 * Mobile navigation.
 *
 * A full-screen overlay rather than a dropdown: on a site whose selling point
 * is composure, a cramped menu panel undercuts everything around it. Radix
 * Dialog supplies the focus trap, scroll lock, `inert` background, and Escape
 * handling â€” all things that are easy to hand-roll almost correctly.
 */
export function MobileNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Navigating does not unmount this component, so the menu would otherwise
  // stay open on top of the page the user just asked for. Adjusted during
  // render rather than in an effect, so the open menu is never painted over
  // the new page for a frame.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={dict.nav.openMenu}
          className="text-text-muted hover:bg-surface hover:text-text inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="16" x2="15" y2="16" />
            </g>
          </svg>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
                className="bg-bg/60 fixed inset-0 z-50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32, ease: easeEntrance }}
                className="bg-bg fixed inset-0 z-50 flex flex-col overflow-y-auto"
              >
                <Dialog.Title className="sr-only">{dict.nav.openMenu}</Dialog.Title>

                <KhatamPattern className="text-accent" opacity={0.04} />

                <div className="relative flex h-20 shrink-0 items-center justify-end px-5 sm:px-8">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={dict.nav.closeMenu}
                      className="text-text-muted hover:bg-surface hover:text-text inline-flex size-11 items-center justify-center rounded-full transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                        </g>
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>

                <nav
                  aria-label="Main"
                  className="relative flex flex-1 flex-col justify-center gap-1 px-6 pb-10 sm:px-10"
                >
                  {navRoutes.map((route, index) => (
                    <motion.div
                      key={route.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06 + index * 0.05,
                        duration: 0.36,
                        ease: easeEntrance,
                      }}
                    >
                      <Link
                        href={localePath(locale, route.path)}
                        className="border-border font-display hover:text-accent block border-b py-5 text-[length:var(--text-display-sm)] transition-colors"
                      >
                        {dict.nav[route.labelKey]}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.36, ease: easeEntrance }}
                    className="mt-10 flex flex-col gap-6"
                  >
                    <Button href={localePath(locale, "/design")} size="lg" className="w-full">
                      {dict.nav.design}
                    </Button>
                    <LocaleSwitcher
                      locale={locale}
                      label={dict.locale.label}
                      className="self-start sm:hidden"
                    />
                  </motion.div>
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
