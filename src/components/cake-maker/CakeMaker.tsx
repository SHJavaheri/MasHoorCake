"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { useState } from "react";

import { text } from "@/content/l10n";
import type { CategoryId } from "@/content/cake-maker/schema";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import type { Locale } from "@/lib/i18n/config";
import { transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";

import {
  CakeMakerProvider,
  useDerived,
  useDesign,
} from "@/components/cake-maker/CakeMakerProvider";
import { CakePreview, PreviewPane } from "@/components/cake-maker/PreviewPane";
import { CategoryPanel, EstimateBadge } from "@/components/cake-maker/panels";
import { PrintSheet, RequestSummary } from "@/components/cake-maker/RequestSummary";
import { visibleCategories } from "@/lib/cake-maker/availability";
import { hasSelection } from "@/lib/cake-maker/state";

/**
 * The Cake Maker.
 *
 * Desktop and mobile are deliberately different arrangements of the same three
 * parts rather than one layout that reflows:
 *
 *   desktop  category rail | option grid  ||  persistent cake + estimate
 *   mobile   cake dock on top, then category pills, then the option grid,
 *            with the estimate pinned to the bottom
 *
 * On a phone the cake has to lead — it is the reason to keep scrolling — while
 * on a wide screen it belongs beside the choices so both are visible at once.
 */
export function CakeMaker({ locale }: { locale: Locale }) {
  return (
    <CakeMakerProvider locale={locale}>
      <CakeMakerLayout locale={locale} />
    </CakeMakerProvider>
  );
}

function CakeMakerLayout({ locale }: { locale: Locale }) {
  const design = useDesign();
  const { seededFrom } = useDerived();
  const categories = visibleCategories(design);

  const [requested, setRequested] = useState<CategoryId | null>(null);
  const [reviewing, setReviewing] = useState(false);

  // A category can vanish under the customer: removing the plaque closes the
  // writing tab. Rather than correcting the selection in an effect after the
  // fact, the active tab is derived — an unavailable choice simply falls back.
  const active =
    requested && categories.some((category) => category.id === requested)
      ? requested
      : (categories[0]?.id ?? "shape");

  // Choosing a filling changes nothing visible under an opaque frosting, so the
  // cake opens up while that tab is active and closes again when it isn't.
  const showsInside = active === "filling";

  return (
    <>
      <Container width="wide" className="pb-12">
        {seededFrom && (
          <p className="border-border bg-bg-subtle rounded-card text-text-muted mb-8 border p-4 text-sm">
            Starting from <span className="text-text">{seededFrom}</span>. Change anything you
            like.
          </p>
        )}

        <Tabs.Root
          value={active}
          onValueChange={(value) => setRequested(value as CategoryId)}
          // Manual activation: automatic would swap a twenty-card grid out from
          // under a screen-reader user simply arrowing along the tab list.
          activationMode="manual"
          orientation="horizontal"
          className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
        >
          {/* ---------------------------------------------------------- */}
          {/* Mobile: the cake leads.                                     */}
          {/* ---------------------------------------------------------- */}
          <MobileCakeDock cutaway={showsInside} />

          {/* ---------------------------------------------------------- */}
          {/* Left column — categories and their options.                 */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:flex lg:gap-6">
            <Tabs.List
              aria-label="Cake options"
              className={cn(
                // Mobile: a snapping pill strip. Logical scroll padding so it
                // starts correctly in RTL too.
                "-mx-5 flex snap-x snap-mandatory scroll-ps-5 [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-3",
                "bg-bg/95 sticky top-[calc(var(--dock-h,14rem)+4rem)] z-10 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none",
                // Desktop: a vertical rail.
                "lg:mx-0 lg:w-52 lg:shrink-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0",
              )}
            >
              {categories.map((category) => (
                <Tabs.Trigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "rounded-chip shrink-0 snap-start px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                    "text-text-muted hover:text-text",
                    "data-[state=active]:bg-accent data-[state=active]:text-accent-contrast",
                    "focus-visible:outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    "lg:w-full lg:text-start",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {text(category.label, locale)}
                    {hasSelection(design, category.id) && (
                      <span
                        aria-hidden="true"
                        className="inline-block size-1.5 rounded-full bg-current opacity-50"
                      />
                    )}
                  </span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="min-w-0 flex-1 pt-6 lg:pt-0">
              {categories.map((category) => (
                <Tabs.Content
                  key={category.id}
                  value={category.id}
                  className="focus-visible:outline-none"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition.entrance}
                  >
                    <h2 className="font-display mb-1 text-[length:var(--text-display-sm)] lg:sr-only">
                      {text(category.label, locale)}
                    </h2>
                    <CategoryPanel category={category} locale={locale} />
                  </motion.div>
                </Tabs.Content>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Right column — desktop only; the cake lives at the top on   */}
          {/* mobile instead.                                             */}
          {/* ---------------------------------------------------------- */}
          <PreviewPane
            cutaway={showsInside}
            className="sticky top-24 hidden h-[calc(100dvh-8rem)] lg:flex"
          >
            <EstimateBadge className="border-border border-t pt-5" />
            <button
              type="button"
              onClick={() => setReviewing(true)}
              className="bg-accent text-accent-contrast hover:bg-accent-hover rounded-chip mt-5 min-h-12 w-full px-6 font-medium transition-colors"
            >
              Review your request
            </button>
          </PreviewPane>
        </Tabs.Root>
      </Container>

      {/* Mobile bottom bar. StickyActionBar hides itself on this route so the
          two can never stack. */}
      <div className="border-border bg-bg/95 fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t px-5 py-3 backdrop-blur-xl lg:hidden">
        <EstimateBadge compact className="flex-1" />
        <button
          type="button"
          onClick={() => setReviewing(true)}
          className="bg-accent text-accent-contrast rounded-chip min-h-12 px-6 font-medium"
        >
          Review
        </button>
      </div>

      <RequestSummary open={reviewing} onClose={() => setReviewing(false)} locale={locale} />

      {/* The printed copy, in the normal document flow where the @media print
          rules can find it — printing out of the dialog's portal is unreliable
          across browsers. */}
      <PrintSheet locale={locale} />

      {/* The PDF's copy of the cake. It has to be a real, laid-out SVG element
          for svg2pdf to walk, so it is hidden with clip rather than with
          `display: none`, which would leave it unmeasured. Always light chrome:
          the PDF is a printed artefact, not a themed page. */}
      <div
        id="pdf-cake"
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 size-[400px] overflow-hidden opacity-0 print:hidden"
        style={{ clipPath: "inset(50%)" }}
      >
        <CakePreview idPrefix="pdf" animate={false} forceLightChrome />
      </div>
    </>
  );
}

/**
 * The mobile preview: pinned under the header and shrinking as the customer
 * scrolls into the options, using the same scroll-direction hook the header
 * itself uses so the two move in sympathy rather than fighting.
 */
function MobileCakeDock({ cutaway }: { cutaway: boolean }) {
  const { direction } = useScrollDirection({ threshold: 40 });
  const collapsed = direction === "down";

  return (
    <motion.div
      animate={{ height: collapsed ? "7rem" : "14rem" }}
      transition={transition.fast}
      style={{ ["--dock-h" as string]: collapsed ? "7rem" : "14rem" }}
      className="bg-bg sticky top-16 z-10 -mx-5 mb-2 flex items-end justify-center overflow-hidden px-5 lg:hidden"
    >
      <CakePreview
        idPrefix="dock"
        animate={false}
        cutaway={cutaway}
        className="max-h-full"
      />
    </motion.div>
  );
}
