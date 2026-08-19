"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/url";
import { spring, transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

import { CakePreview } from "@/components/cake-maker/PreviewPane";
import {
  useDerived,
  useDesign,
  useReferenceImage,
} from "@/components/cake-maker/CakeMakerProvider";
import { designToParams, notesWereTruncated } from "@/lib/cake-maker/encode";
import { composeRequestMessage, shareTargets } from "@/lib/cake-maker/share";
import { downloadRequestPdf } from "@/lib/cake-maker/pdf";
import type { SummaryModel } from "@/lib/cake-maker/summary";

/**
 * The Cake Request Summary.
 *
 * A receipt for something that is explicitly not a purchase, which is the whole
 * design problem: it has to look complete and considered enough to be worth
 * sending, while never implying that anything has been booked or paid for. The
 * "not an order" line is therefore part of the sheet, not a footnote.
 */
export function RequestSummary({
  open,
  onClose,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
                className="bg-scrim/60 fixed inset-0 z-50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={spring.surface}
                className="bg-bg rounded-t-panel sm:rounded-panel fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto sm:inset-0 sm:m-auto sm:h-fit sm:max-w-2xl"
              >
                <Dialog.Title className="sr-only">Your Cake Request</Dialog.Title>
                <SummarySheet locale={locale} onClose={onClose} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/**
 * The sheet itself.
 *
 * Rendered twice: here inside the dialog, and again by PrintSheet into the
 * normal document flow where the print stylesheet can find it. Printing out of
 * a portal with `inert` siblings is unreliable across browsers, so the printed
 * copy deliberately is not this one.
 */
function SummarySheet({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const design = useDesign();
  const { summary } = useDerived();
  const { image } = useReferenceImage();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = absoluteUrl(`/${locale}/design/?${designToParams(design).toString()}`);
  const message = composeRequestMessage(summary, shareUrl);
  const targets = shareTargets(message, shareUrl, `Cake request: ${site.name}`);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be denied; the text is on screen either way.
    }
  }

  async function handleDownload() {
    setBusy(true);
    try {
      await downloadRequestPdf({ design, summary, image, shareUrl });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-text-subtle text-sm">{site.name}</p>
          <h2 className="font-display text-[length:var(--text-display-sm)]">
            Your Cake Request
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-text-muted hover:text-text -me-2 -mt-2 p-2"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 20 20"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <SummaryBody summary={summary} referenceUrl={image?.objectUrl ?? null} />

      {notesWereTruncated(design) && (
        <p className="text-text-subtle mt-4 text-sm">
          Your notes are longer than a link can carry. The full text is in the message and the
          PDF.
        </p>
      )}

      {/* Actions */}
      <div className="border-border mt-8 border-t pt-6">
        <p className="text-text-subtle mb-3 text-sm">Send it to us</p>
        <div className="flex flex-wrap gap-2">
          {targets.map((target) =>
            target.href ? (
              <a
                key={target.id}
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border-strong hover:border-accent rounded-chip inline-flex min-h-11 items-center gap-2 border px-5 text-sm transition-colors"
              >
                {target.Icon && <target.Icon className="size-4" aria-hidden="true" />}
                {target.label}
              </a>
            ) : (
              <button
                key={target.id}
                type="button"
                onClick={handleCopy}
                className="border-border-strong hover:border-accent rounded-chip inline-flex min-h-11 items-center border px-5 text-sm transition-colors"
              >
                {copied ? "Copied" : target.label}
              </button>
            ),
          )}
        </div>

        <p className="text-text-subtle mt-6 mb-3 text-sm">Keep a copy</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="border-border-strong hover:border-accent rounded-chip inline-flex min-h-11 items-center border px-5 text-sm transition-colors disabled:opacity-50"
          >
            {busy ? "Preparing…" : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="border-border-strong hover:border-accent rounded-chip inline-flex min-h-11 items-center border px-5 text-sm transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      {image && (
        <p className="text-text-subtle mt-6 text-sm">
          Your reference photo is in the PDF, but it can&rsquo;t travel in a message. Send it
          in the chat right after.
        </p>
      )}
    </div>
  );
}

/** The receipt body, shared by the dialog and the print sheet. */
export function SummaryBody({
  summary,
  referenceUrl,
  idPrefix = "summary",
}: {
  summary: SummaryModel;
  referenceUrl: string | null;
  idPrefix?: string;
}) {
  return (
    <>
      <div className="border-border rounded-card print-avoid-break mt-6 flex items-end justify-center border p-4">
        <CakePreview idPrefix={idPrefix} animate={false} className="h-48" />
      </div>

      <dl className="mt-6 text-sm">
        {summary.rows.map((row) => (
          <div
            key={row.id}
            className="border-border flex justify-between gap-6 border-b py-2.5 last:border-0"
          >
            <dt className="text-text-subtle shrink-0">{row.label}</dt>
            <dd className="text-end">{row.value}</dd>
          </div>
        ))}
      </dl>

      {summary.writing && <Block label="Writing">&ldquo;{summary.writing}&rdquo;</Block>}
      {summary.notes && <Block label="Special requests">{summary.notes}</Block>}

      {referenceUrl && (
        <Block label="Reference photo">
          <img
            src={referenceUrl}
            alt="The reference you attached"
            className="mt-2 max-h-48 rounded-lg object-contain"
          />
        </Block>
      )}

      {/* The estimate and the disclaimer are one block, deliberately. */}
      <div className="border-accent bg-accent-subtle/30 rounded-card print-avoid-break mt-6 border p-4">
        <p className="flex items-baseline justify-between gap-4">
          <span className="text-text-subtle text-sm">Estimated Price</span>
          <span className="font-display text-[length:var(--text-title)] tabular-nums">
            {summary.estimate}
          </span>
        </p>
        <p className="text-text-muted mt-2 text-sm leading-snug">
          This is an estimate only. Final pricing will be confirmed directly by {site.name}{" "}
          after reviewing your request.
        </p>
      </div>

      <p className="text-text-subtle mt-4 text-sm leading-snug">
        This is a request, not an order. Nothing has been booked and no payment has been taken. {" "}
        {site.name} will be in touch to confirm everything with you personally.
      </p>
    </>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="print-avoid-break mt-5">
      <p className="text-text-subtle text-sm">{label}</p>
      <div className={cn("mt-1 text-sm leading-relaxed")}>{children}</div>
    </div>
  );
}

/**
 * The printed copy.
 *
 * Lives in the normal document flow, hidden on screen, so the @media print
 * rules in globals.css can hide `body > *:not(#print-sheet)` and be left with
 * exactly this.
 */
export function PrintSheet({ locale }: { locale: Locale }) {
  const { summary } = useDerived();
  const { image } = useReferenceImage();
  void locale;

  return (
    <div id="print-sheet" className="hidden print:block">
      <p className="text-text-subtle text-sm">{site.name}</p>
      <h1 className="font-display text-2xl">Cake Request Summary</h1>
      <SummaryBody summary={summary} referenceUrl={image?.objectUrl ?? null} idPrefix="print" />
    </div>
  );
}
