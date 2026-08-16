"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CakeImage } from "@/components/ui/CakeImage";
import type { Cake } from "@/content/schema";
import {
  allergens as allergenTerms,
  colorFamilies,
  fillings as fillingTerms,
  findTerm,
  flavours as flavourTerms,
  occasions as occasionTerms,
  styles as styleTerms,
} from "@/content/taxonomy";
import { imageKey } from "@/lib/gallery/cakes";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { saveIntent } from "@/lib/order/intent";
import { spring, transition } from "@/lib/motion/tokens";

/**
 * Cake detail view.
 *
 * On desktop this is a centred dialog; on mobile it is a bottom sheet that can
 * be dragged away, which is the gesture people already expect from native apps.
 *
 * The cover image carries the same `layoutId` as the grid card, so it flies
 * from the grid into the dialog rather than the dialog simply appearing over
 * it. That continuity is the single most expensive-feeling moment on the site.
 *
 * Radix supplies the focus trap, scroll lock, background `inert`, and Escape
 * handling. Arrow keys move between cakes within the current filter set, so
 * browsing momentum survives opening something.
 */
export function CakeModal({
  cake,
  locale,
  dict,
  onClose,
  onPrev,
  onNext,
}: {
  cake: Cake | null;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);

  // Moving to another cake must not keep the previous cake's carousel position.
  // Adjusted during render rather than in an effect: React re-renders before
  // painting, so the stale index is never shown, and there is no extra pass.
  const [renderedSlug, setRenderedSlug] = useState(cake?.slug);
  if (cake?.slug !== renderedSlug) {
    setRenderedSlug(cake?.slug);
    setImageIndex(0);
  }

  useEffect(() => {
    if (!cake) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") onNext?.();
      if (event.key === "ArrowLeft") onPrev?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cake, onNext, onPrev]);

  function handleOrderSimilar() {
    if (!cake) return;
    // Seeds the order page and the Google Form prefill with this cake.
    saveIntent({
      cakeSlug: cake.slug,
      cakeName: cake.name[locale],
      flavour: cake.flavours.map((s) => findTerm(flavourTerms, s)?.label[locale]).join(", "),
      filling: cake.fillings.map((s) => findTerm(fillingTerms, s)?.label[locale]).join(", "),
      occasion: findTerm(occasionTerms, cake.occasions[0])?.label[locale],
      tiers: cake.tiers,
      servings: cake.servings.max,
    });
    router.push(localePath(locale, "/order"));
  }

  const image = cake?.images[imageIndex] ?? cake?.images[0];

  return (
    <Dialog.Root open={cake !== null} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {cake && image && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
                className="bg-scrim/70 fixed inset-0 z-50 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.4 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 140) onClose();
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={spring.surface}
                className="bg-bg fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[2rem] shadow-[var(--shadow-lg)] sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[88dvh] sm:max-w-5xl sm:rounded-[2rem]"
              >
                {/* Drag affordance, mobile only. */}
                <div className="flex shrink-0 justify-center pt-3 sm:hidden">
                  <span className="bg-border-strong h-1 w-10 rounded-full" aria-hidden="true" />
                </div>

                <div className="grid flex-1 overflow-y-auto sm:grid-cols-[1.1fr_1fr] sm:overflow-hidden">
                  <div className="bg-surface-sunken relative sm:overflow-hidden">
                    <motion.div layoutId={`cake-image-${cake.slug}`}>
                      <CakeImage
                        name={imageKey(image.src)}
                        alt={image.alt[locale]}
                        sizes="(max-width: 640px) 100vw, 55vw"
                        className="sm:h-full"
                        imgClassName="sm:h-full"
                      />
                    </motion.div>

                    {cake.images.length > 1 && (
                      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                        {cake.images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setImageIndex(i)}
                            aria-label={`Image ${i + 1}`}
                            aria-current={i === imageIndex}
                            className={`size-2 rounded-full transition-colors ${
                              i === imageIndex ? "bg-on-scrim" : "bg-on-scrim/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-5 overflow-y-auto p-6 sm:p-8">
                    <div>
                      <Dialog.Title className="font-display text-[length:var(--text-display-sm)]">
                        {cake.name[locale]}
                      </Dialog.Title>
                      <Dialog.Description className="text-text-muted mt-3">
                        {cake.description[locale]}
                      </Dialog.Description>
                    </div>

                    <dl className="border-border grid grid-cols-2 gap-4 border-y py-5 text-sm">
                      <Detail label={dict.gallery.detailServings}>
                        {cake.servings.min}–{cake.servings.max}
                      </Detail>
                      <Detail label={dict.gallery.detailTiers}>{cake.tiers}</Detail>
                      {cake.dimensions && (
                        <Detail label={dict.gallery.detailSize}>{cake.dimensions}</Detail>
                      )}
                      <Detail label={dict.gallery.detailPrice}>
                        {cake.priceFrom
                          ? `${dict.common.from} $${cake.priceFrom}`
                          : dict.common.priceOnRequest}
                      </Detail>
                    </dl>

                    <TermList
                      label={dict.gallery.detailFlavours}
                      slugs={[...cake.flavours, ...cake.fillings]}
                      terms={[...flavourTerms, ...fillingTerms]}
                      locale={locale}
                    />
                    <TermList
                      label={dict.gallery.detailOccasion}
                      slugs={[...cake.occasions, ...cake.styles, ...cake.colorFamilies]}
                      terms={[...occasionTerms, ...styleTerms, ...colorFamilies]}
                      locale={locale}
                    />

                    {cake.ingredients.length > 0 && (
                      <div>
                        <h3 className="text-text-subtle text-sm font-medium">
                          {dict.gallery.detailIngredients}
                        </h3>
                        <p className="text-text-muted mt-2 text-sm">
                          {cake.ingredients.map((i) => i[locale]).join(" · ")}
                        </p>
                      </div>
                    )}

                    {/* Allergens are text, never colour alone. */}
                    {cake.allergens.length > 0 && (
                      <div className="border-border bg-surface rounded-2xl border p-4">
                        <h3 className="text-sm font-medium">{dict.gallery.detailAllergens}</h3>
                        <p className="text-text-muted mt-1.5 text-sm">
                          {cake.allergens
                            .map((s) => findTerm(allergenTerms, s)?.label[locale])
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {cake.dietaryNotes && (
                          <p className="text-text-muted mt-2 text-sm">
                            {cake.dietaryNotes[locale]}
                          </p>
                        )}
                      </div>
                    )}

                    <Button onClick={handleOrderSimilar} size="md" className="mt-auto w-full">
                      {dict.gallery.orderSimilar}
                      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label={dict.gallery.close}
                    className="bg-bg/80 text-text hover:bg-surface absolute end-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full backdrop-blur transition-colors"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </Dialog.Close>

                {onPrev && (
                  <NavButton side="start" onClick={onPrev} label={dict.gallery.previous} />
                )}
                {onNext && <NavButton side="end" onClick={onNext} label={dict.gallery.next} />}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-text-subtle">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

function TermList({
  label,
  slugs,
  terms,
  locale,
}: {
  label: string;
  slugs: string[];
  terms: { slug: string; label: Record<string, string> }[];
  locale: Locale;
}) {
  const resolved = slugs
    .map((s) => terms.find((t) => t.slug === s)?.label[locale])
    .filter((v): v is string => Boolean(v));

  if (resolved.length === 0) return null;

  return (
    <div>
      <h3 className="text-text-subtle text-sm font-medium">{label}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {resolved.map((value) => (
          <li
            key={value}
            className="border-border bg-surface text-text-muted rounded-full border px-3 py-1 text-sm"
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavButton({
  side,
  onClick,
  label,
}: {
  side: "start" | "end";
  onClick: () => void;
  label: string;
}) {
  // Chevrons point outward in the reading direction, so they mirror under RTL.
  const Icon = side === "start" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`bg-bg/80 text-text hover:bg-surface absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur transition-colors lg:inline-flex ${
        side === "start" ? "start-4" : "end-4"
      }`}
    >
      <Icon className="size-5 rtl:rotate-180" aria-hidden="true" />
    </button>
  );
}
