"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { orderForm } from "@/config/order";
import { useMounted } from "@/hooks/useMediaQuery";
import { contactChannels } from "@/lib/contact/channels";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  buildOrderUrl,
  clearIntent,
  describeIntent,
  readIntent,
  type OrderIntent,
} from "@/lib/order/intent";
import { spring } from "@/lib/motion/tokens";

/**
 * The order handoff.
 *
 * Everything here exists to make a third-party form feel like part of the site.
 * If someone arrived from a cake or a flavour combination, that choice is shown
 * back to them and folded into the form's pre-fill URL, so the Google Form opens
 * already knowing what they want.
 *
 * The intent is read in an effect rather than during render because
 * sessionStorage does not exist on the server, and a static export prerenders
 * this page at build time.
 */
export function OrderHandoff({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  // sessionStorage does not exist on the server and this page is prerendered at
  // build time, so the intent can only be read once hydration has happened.
  const mounted = useMounted();
  const [dismissed, setDismissed] = useState(false);
  const intent: OrderIntent | null = useMemo(
    () => (mounted && !dismissed ? readIntent() : null),
    [mounted, dismissed],
  );

  function dismiss() {
    clearIntent();
    setDismissed(true);
  }

  const channels = contactChannels(
    intent
      ? `${dict.contact.chatGreeting} (${describeIntent(intent, dict.common.servings)})`
      : dict.contact.chatGreeting,
  );

  const formUrl = buildOrderUrl(intent);
  const isPlaceholder = orderForm.formUrl.includes("PLACEHOLDER");

  return (
    <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <AnimatePresence>
          {intent && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={spring.gentle}
              className="mb-10 overflow-hidden"
            >
              <div className="border-accent/40 bg-accent-subtle/15 flex items-start justify-between gap-4 rounded-[1.5rem] border p-6">
                <div>
                  <p className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
                    {dict.order.seededTitle}
                  </p>
                  <p className="font-display mt-2 text-[length:var(--text-title)]">
                    {describeIntent(intent, dict.common.servings)}
                  </p>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="text-text-muted hover:text-accent mt-3 text-sm underline underline-offset-4 transition-colors"
                  >
                    {dict.order.seededClear}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label={dict.order.seededClear}
                  className="text-text-subtle hover:bg-surface hover:text-text shrink-0 rounded-full p-2 transition-colors"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-[length:var(--text-display-sm)]">{dict.order.checklistTitle}</h2>
        <p className="text-text-muted mt-4">{dict.order.checklistIntro}</p>

        <ul className="mt-8 space-y-4">
          {orderForm.checklist[locale].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="text-accent mt-1 size-4 shrink-0" aria-hidden="true" />
              <span className="text-text-muted">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {isPlaceholder ? (
            /* Better an honest disabled state than a button that leads nowhere. */
            <div className="border-border rounded-2xl border border-dashed p-6">
              <p className="text-text-muted text-sm">
                TODO(content): the Google Form link is still a placeholder. Add it in
                <code className="bg-surface mx-1.5 rounded px-1.5 py-0.5 text-xs">
                  src/config/order.ts
                </code>
                to activate this button.
              </p>
              <Button size="lg" className="pointer-events-none mt-5 opacity-50">
                {dict.order.cta}
              </Button>
            </div>
          ) : (
            <>
              <Button href={formUrl} size="lg" external>
                {dict.order.cta}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
              <p className="text-text-subtle mt-3 text-sm">{dict.order.ctaNote}</p>
            </>
          )}
        </div>
      </div>

      <aside className="border-border bg-surface rounded-[1.75rem] border p-7">
        <h2 className="font-display text-[length:var(--text-title)]">{dict.order.orContact}</h2>
        <ul className="mt-6 space-y-2">
          {channels.map((channel) => (
            <li key={channel.id}>
              <a
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="hover:bg-bg flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
              >
                <channel.Icon className="text-accent size-5 shrink-0" aria-hidden="true" />
                <span className="text-text-muted">{channel.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
