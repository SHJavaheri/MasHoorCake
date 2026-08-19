"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";

import { cakeMakerCatalog, getSize } from "@/content/cake-maker";
import { text } from "@/content/l10n";
import type { CakeCategory, CategoryId } from "@/content/cake-maker/schema";
import type { Locale } from "@/lib/i18n/config";
import { spring, transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";
import { formatEstimate } from "@/lib/cake-maker/pricing";

import { OptionCard, SwatchCard } from "@/components/cake-maker/OptionCard";
import {
  useDerived,
  useDesign,
  useDesignDispatch,
  useReferenceImage,
} from "@/components/cake-maker/CakeMakerProvider";
import { availableOptions } from "@/lib/cake-maker/availability";
import {
  ACCEPTED_TYPES,
  MAX_REFERENCE_BYTES,
  acceptReferenceFile,
} from "@/lib/cake-maker/referenceImage";

/**
 * The panels behind each category tab.
 *
 * One component per `category.kind`, dispatched by CategoryPanel. Adding a
 * flavour never touches this file; adding a whole new *kind* of question does,
 * which is the intended amount of friction.
 */

export function CategoryPanel({
  category,
  locale,
}: {
  category: CakeCategory;
  locale: Locale;
}) {
  switch (category.kind) {
    case "single":
    case "multi":
      return <OptionsPanel category={category} locale={locale} />;
    case "swatch":
      return <SwatchPanel category={category} locale={locale} />;
    case "stepper":
      return <SizePanel category={category} locale={locale} />;
    case "text":
      return <TextPanel category={category} locale={locale} />;
    case "upload":
      return <ReferencePanel category={category} locale={locale} />;
  }
}

/* -------------------------------------------------------------------------- */

function PanelHeading({ category, locale }: { category: CakeCategory; locale: Locale }) {
  return (
    <>
      <legend className="sr-only">{text(category.label, locale)}</legend>
      {category.helper && (
        <p className="text-text-muted mb-5 text-sm">{text(category.helper, locale)}</p>
      )}
    </>
  );
}

/** Which ids are currently selected in a category. */
function useSelected(category: CategoryId): string[] {
  const design = useDesign();
  switch (category) {
    case "shape":
      return [design.shape];
    case "size":
      return [design.size];
    case "flavour":
      return [design.flavour];
    case "filling":
      return design.filling ? [design.filling] : [];
    case "frosting":
      return [design.frosting];
    case "frostingColour":
      return design.frostingColour ? [design.frostingColour] : [];
    case "toppings":
      return design.toppings;
    case "decorations":
      return design.decorations;
    case "theme":
      return design.theme ? [design.theme] : [];
    default:
      return [];
  }
}

/* -------------------------------------------------------------------------- */

function OptionsPanel({ category, locale }: { category: CakeCategory; locale: Locale }) {
  const design = useDesign();
  const dispatch = useDesignDispatch();
  const selected = useSelected(category.id);
  const options = availableOptions(category.id, design);

  const multi = category.kind === "multi";
  const atCap =
    multi && category.maxSelections !== undefined && selected.length >= category.maxSelections;

  return (
    <fieldset>
      <PanelHeading category={category} locale={locale} />

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <OptionCard
              key={option.id}
              option={option}
              locale={locale}
              name={`cake-${category.id}`}
              type={multi ? "checkbox" : "radio"}
              checked={checked}
              // A capped multi-select greys out what you cannot add, but never
              // what you could remove.
              disabled={multi && atCap && !checked}
              onChange={() =>
                dispatch({
                  type: multi ? "toggle" : "select",
                  category: category.id,
                  optionId: option.id,
                })
              }
            />
          );
        })}
      </div>

      {atCap && (
        <p className="text-text-subtle mt-4 text-sm">
          That&rsquo;s the maximum. Remove one to choose another.
        </p>
      )}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */

function SwatchPanel({ category, locale }: { category: CakeCategory; locale: Locale }) {
  const design = useDesign();
  const dispatch = useDesignDispatch();
  const selected = useSelected(category.id);
  const options = availableOptions(category.id, design);

  return (
    <fieldset>
      <PanelHeading category={category} locale={locale} />

      <div className="grid grid-cols-4 gap-5 sm:grid-cols-5 xl:grid-cols-6">
        {options.map((option) => (
          <SwatchCard
            key={option.id}
            option={option}
            locale={locale}
            name={`cake-${category.id}`}
            checked={selected.includes(option.id)}
            onChange={() =>
              dispatch({ type: "select", category: category.id, optionId: option.id })
            }
          />
        ))}
      </div>

      <p className="text-text-subtle mt-6 text-sm">
        Colours are mixed by eye and vary a little batch to batch. Send a photo or a swatch if
        the shade has to be exact.
      </p>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Size is a card grid rather than a numeric stepper: the question a customer
 * actually has is "how many people does this feed", and the answer belongs on
 * the card next to the choice, not behind a slider they have to interpret.
 */
function SizePanel({ category, locale }: { category: CakeCategory; locale: Locale }) {
  const design = useDesign();
  const dispatch = useDesignDispatch();
  const size = getSize(design.size);

  return (
    <fieldset>
      <PanelHeading category={category} locale={locale} />

      <div className="grid grid-cols-2 gap-3">
        {cakeMakerCatalog.sizes.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            locale={locale}
            name="cake-size"
            type="radio"
            checked={design.size === option.id}
            onChange={() => dispatch({ type: "select", category: "size", optionId: option.id })}
          />
        ))}
      </div>

      <p className="text-text-subtle mt-5 text-sm" aria-live="polite">
        {size
          ? `Serves roughly ${size.servings}. Portions assume dessert slices. Coffee sized portions serve more.`
          : null}
      </p>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */

function TextPanel({ category, locale }: { category: CakeCategory; locale: Locale }) {
  const design = useDesign();
  const dispatch = useDesignDispatch();
  const id = useId();

  const field = category.id === "writing" ? "writing" : "notes";
  const value = design[field];
  const max = category.maxLength ?? 200;
  const long = field === "notes";

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {text(category.label, locale)}
      </label>
      {category.helper && (
        <p className="text-text-muted mb-4 text-sm">{text(category.helper, locale)}</p>
      )}

      {long ? (
        <textarea
          id={id}
          value={value}
          rows={6}
          maxLength={max}
          onChange={(event) => dispatch({ type: "setText", field, value: event.target.value })}
          placeholder="Allergies, the date you need it, colours to match, anything you're unsure about."
          className="border-border bg-surface focus-visible:border-accent rounded-card w-full border p-4 outline-none"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          maxLength={max}
          onChange={(event) => dispatch({ type: "setText", field, value: event.target.value })}
          placeholder="Happy Birthday Yara"
          className="border-border bg-surface focus-visible:border-accent rounded-card w-full border p-4 outline-none"
        />
      )}

      <p className="text-text-subtle mt-2 text-end text-sm tabular-nums">
        {value.length} / {max}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ReferencePanel({ category, locale }: { category: CakeCategory; locale: Locale }) {
  const { image, setImage } = useReferenceImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [rejected, setRejected] = useState<"type" | "size" | null>(null);

  return (
    <div>
      {category.helper && (
        <p className="text-text-muted mb-4 text-sm">{text(category.helper, locale)}</p>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;

          const result = acceptReferenceFile(file);
          setRejected(result.ok ? null : result.reason);
          setImage(result.ok ? result.image : null);

          // Allow re-picking the same file after a rejection.
          event.target.value = "";
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {image ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="border-border bg-surface rounded-card flex items-center gap-4 border p-4"
          >
            {/* A plain <img>, not next/image: this is a blob: URL for a file
                that never leaves the browser and has no intrinsic size known
                ahead of time. */}
            <img
              src={image.objectUrl}
              alt="The reference you attached"
              className="size-24 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{image.name}</p>
              <p className="text-text-subtle text-sm">
                {(image.sizeBytes / 1024 / 1024).toFixed(1)} MB
              </p>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="text-accent mt-2 text-sm underline underline-offset-4"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={() => inputRef.current?.click()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="border-border-strong text-text-muted hover:border-accent hover:text-text rounded-card flex w-full flex-col items-center gap-2 border border-dashed p-10 transition-colors"
          >
            <span className="font-display text-[length:var(--text-title)]">Choose a photo</span>
            <span className="text-sm">
              PNG, JPEG or WebP, up to {MAX_REFERENCE_BYTES / 1024 / 1024} MB
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {rejected && (
        <p className="text-secondary mt-3 text-sm" role="alert">
          {rejected === "size"
            ? "That file is too large. Try one under 8 MB."
            : "That file type isn't supported. Use a PNG, JPEG or WebP."}
        </p>
      )}

      {/* The honest explanation, stated before they share rather than after. */}
      <div className="border-border bg-bg-subtle rounded-card mt-5 border p-4 text-sm">
        <p className="font-medium">Your photo stays on your device.</p>
        <p className="text-text-muted mt-1.5">
          This site has no server to upload it to, so it can&rsquo;t travel in a shared link or
          a WhatsApp message. It <em>is</em> included in the PDF, so download that and attach
          it, or just send the photo in the chat after your request.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The running estimate — the only component in the app that renders a price.
 *
 * The word "estimate" is part of this component, not a caption a caller can
 * leave off. `compact` shortens the wording for the mobile bar; it does not
 * remove it. There is deliberately no prop that shows a bare number.
 */
export function EstimateBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { estimate } = useDerived();

  const amount = (
    <motion.span
      key={estimate.total}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={spring.gentle}
      className="font-display tabular-nums"
    >
      {formatEstimate(estimate.total)}
    </motion.span>
  );

  if (compact) {
    return (
      <p className={cn("text-sm leading-tight", className)} aria-live="polite">
        <span className="text-[length:var(--text-title)]">{amount}</span>{" "}
        <span className="text-text-subtle">estimate. Final price confirmed by us</span>
      </p>
    );
  }

  return (
    <div className={cn("text-start", className)}>
      <p className="text-text-subtle text-sm">Estimated starting price</p>
      <p className="text-[length:var(--text-display-sm)] leading-tight" aria-live="polite">
        {amount}
      </p>
      <p className="text-text-subtle mt-1 text-sm leading-snug">
        An estimate only. Mas Hoor Cake confirms the final price after reviewing your request.
      </p>
    </div>
  );
}
